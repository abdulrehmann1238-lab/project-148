import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Play,
  Pause,
  RotateCcw,
  Check,
  Clock,
  Layers,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useDentistStore } from '../../store/dentistStore';
import { useDemoStore } from '../../store/demoStore';
import { SAMPLE_ABOUTS } from '../../mock/sampleAbouts';

interface ErrorRow {
  row: number;
  unique_id: string;
  field: string;
  issue: string;
  action: 'Skipped' | 'Imported with warning';
}

export function Import() {
  const { bulkUpsert } = useDentistStore();
  const {
    importTimeoutAt117,
    importPace,
    completeGuideStep,
  } = useDemoStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<'master' | 'incremental' | 'custom' | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [batchSize, setBatchSize] = useState<500 | 1000>(1000);
  const [isDryRun, setIsDryRun] = useState(false);

  // Import running states
  const [currentBatch, setCurrentBatch] = useState(0);
  const [totalBatches, setTotalBatches] = useState(300);
  const [isPaused, setIsPaused] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeoutNotice, setTimeoutNotice] = useState<string | null>(null);

  // Live counters
  const [inserted, setInserted] = useState(0);
  const [updated, setUpdated] = useState(0);
  const [unchanged, setUnchanged] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Timing
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Error log
  const [errorLog, setErrorLog] = useState<ErrorRow[]>([]);
  const [errorFilter, setErrorFilter] = useState<'all' | 'Skipped' | 'Warnings'>('all');

  const timerRef = useRef<any>(null);

  // File selection
  const handleSelectSample = (type: 'master' | 'incremental') => {
    setSelectedFile(type);
    if (type === 'master') {
      setFileName('dnn_master_dentists_300k.csv');
      setFileSize('84.2 MB (300,000 rows)');
      setTotalBatches(300);
    } else {
      setFileName('dnn_incremental_update_2026.csv');
      setFileSize('612 KB (1,850 rows)');
      setTotalBatches(batchSize === 500 ? 4 : 2);
    }
    setStep(2);
  };

  const handleStartImport = () => {
    setStep(3);
    setCurrentBatch(1);
    setIsFinished(false);
    setIsPaused(false);
    setInserted(0);
    setUpdated(0);
    setUnchanged(0);
    setSkipped(0);
    setLogs(['Batch ingestion initialized. Connection verified.']);
    setElapsedSeconds(0);
    completeGuideStep('run-importer');
  };

  // Import simulation loop
  useEffect(() => {
    if (step !== 3 || isFinished || isPaused) return;

    const intervalMs = importPace === 'fast' ? 45 : 200;

    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);

      setCurrentBatch((prev) => {
        // Master file Failure Moment at batch 117 per PRD §8.7
        if (selectedFile === 'master' && prev === 117 && importTimeoutAt117 && !timeoutNotice) {
          clearInterval(timerRef.current);
          setTimeoutNotice('Server didn’t respond (timeout). Retrying batch 117 (attempt 2 of 3)…');

          // Auto-recover after 1.2s per PRD §8.7
          setTimeout(() => {
            setTimeoutNotice(null);
            setLogs((l) => [
              `↻ Batch 117 recovered on retry 1 without duplicate entries`,
              ...l.slice(0, 5),
            ]);
            setCurrentBatch(118);
          }, 1200);

          return 117;
        }

        if (prev >= totalBatches) {
          // Finished!
          clearInterval(timerRef.current);
          setIsFinished(true);

          if (selectedFile === 'master') {
            setInserted(12418);
            setUpdated(46902);
            setUnchanged(240639);
            setSkipped(41);
            setErrorLog([
              { row: 142, unique_id: 'DNN-DE-00019', field: 'country', issue: "country 'DE' is not supported (US, CA, UK, AU)", action: 'Skipped' },
              { row: 418, unique_id: '', field: 'unique_id', issue: 'unique_id is missing', action: 'Skipped' },
              { row: 1120, unique_id: 'DNN-US-09182', field: 'postal_code', issue: 'postal_code exceeds 20 characters', action: 'Skipped' },
              { row: 2045, unique_id: 'DNN-UK-00194', field: 'country', issue: "country 'GB' normalized to 'UK'", action: 'Imported with warning' },
              { row: 3102, unique_id: 'DNN-CA-00122', field: 'website', issue: 'website is not a valid URL (cleared)', action: 'Imported with warning' },
              { row: 4890, unique_id: 'DNN-US-004218', field: 'unique_id', issue: 'unique_id appears twice in file; last row used', action: 'Imported with warning' },
            ]);
          } else {
            // Incremental update - REAL STORE MUTATION per PRD §12.4
            setInserted(2);
            setUpdated(3);
            setUnchanged(1843);
            setSkipped(2);
            setErrorLog([
              { row: 18, unique_id: 'DNN-DE-0004', field: 'country', issue: "country 'DE' is not supported", action: 'Skipped' },
              { row: 42, unique_id: '', field: 'unique_id', issue: 'unique_id is missing', action: 'Skipped' },
            ]);

            // Execute real mutations
            bulkUpsert(
              [
                // (a) update Dr. Marcus Whitfield phone
                {
                  unique_id: 'DNN-US-009482',
                  status: '',
                  name: 'Dr. Marcus Whitfield, DDS, MS',
                  practice_name: 'Whitfield Oral & Facial Surgery',
                  address_line_1: '1 Beacon St, Suite 1500',
                  city: 'Boston',
                  state_province_region: 'MA',
                  postal_code: '02108',
                  country: 'US',
                  phone: '+1 (617) 555-0193', // Mutated phone
                  email: 'contact@whitfieldsurgery.example',
                  website: 'https://www.whitfieldsurgery.example',
                  photo_url: 'cover',
                  distinguished: 'Yes',
                  about: SAMPLE_ABOUTS['dr-marcus-whitfield'],
                  facebook_url: '',
                  instagram_url: '',
                  linkedin_url: '',
                  x_url: '',
                  specialty: 'Oral Surgeon',
                  slug: 'dr-marcus-whitfield',
                },
                // (b) update Dr. Daniel Brooks status to blank (Active)
                {
                  unique_id: 'DNN-US-021988',
                  status: '', // blank = Active
                  name: 'Dr. Daniel Brooks, DMD',
                  practice_name: 'Brooks Orthodontics',
                  address_line_1: '1104 S Congress Ave',
                  city: 'Austin',
                  state_province_region: 'TX',
                  postal_code: '78704',
                  country: 'US',
                  phone: '+1 (512) 555-0144',
                  email: 'hello@brooksorthoaustin.example',
                  website: 'https://www.brooksorthoaustin.example',
                  photo_url: 'headshot-1',
                  distinguished: '',
                  about: '',
                  facebook_url: 'https://facebook.com/brooksortho',
                  instagram_url: '',
                  linkedin_url: '',
                  x_url: '',
                  specialty: 'Orthodontist',
                },
                // (d) insert Dr. Hannah Okafor
                {
                  unique_id: 'DNN-UK-009914',
                  status: '', // blank = Active
                  name: 'Dr. Hannah Okafor, BDS',
                  practice_name: 'Manchester Periodontal Clinic',
                  address_line_1: '18 King Street',
                  city: 'Manchester',
                  state_province_region: 'Greater Manchester',
                  postal_code: 'M2 3WQ',
                  country: 'UK',
                  phone: '+44 161 496 0192',
                  email: 'hannah@manchesterperiodontal.example',
                  website: 'https://www.manchesterperiodontal.example',
                  photo_url: 'cover',
                  distinguished: 'Yes',
                  about: SAMPLE_ABOUTS['dr-hannah-okafor'],
                  facebook_url: '',
                  instagram_url: '',
                  linkedin_url: 'https://linkedin.com/in/hannahokafor',
                  x_url: '',
                  specialty: 'Periodontist',
                  slug: 'dr-hannah-okafor',
                },
                // (e) insert Dr. Yuki Tanaka
                {
                  unique_id: 'DNN-CA-008129',
                  status: '', // blank = Active
                  name: 'Dr. Yuki Tanaka, DDS',
                  practice_name: 'Granville Dental Studio',
                  address_line_1: '1050 W Pender St',
                  city: 'Vancouver',
                  state_province_region: 'BC',
                  postal_code: 'V6E 3S7',
                  country: 'CA',
                  phone: '+1 (604) 555-0148',
                  email: 'yuki@granvilledental.example',
                  website: 'https://www.granvilledental.example',
                  photo_url: '', // blank photo
                  distinguished: '',
                  about: '',
                  facebook_url: '',
                  instagram_url: '',
                  linkedin_url: '',
                  x_url: '',
                  specialty: 'General',
                },
              ],
              // (c) Deactivate Dr. Rebecca Alvarez
              ['DNN-US-021107']
            );
          }

          return totalBatches;
        }

        // Ticking progress
        const next = prev + 1;
        const rowsPerBatch = batchSize;
        const currentProcessed = next * rowsPerBatch;

        if (selectedFile === 'master') {
          setInserted((i) => i + Math.floor(Math.random() * 40));
          setUpdated((u) => u + Math.floor(Math.random() * 150));
          setUnchanged((unc) => currentProcessed - 300);
        }

        if (next % 10 === 0 || next === totalBatches) {
          setLogs((l) => [
            `✓ Batch ${next} committed (${rowsPerBatch.toLocaleString()} rows · 0.28s)`,
            ...l.slice(0, 5),
          ]);
        }

        return next;
      });
    }, intervalMs);

    return () => clearInterval(timerRef.current);
  }, [step, isFinished, isPaused, totalBatches, selectedFile, batchSize, importTimeoutAt117, timeoutNotice, importPace, bulkUpsert]);

  // Download error log CSV
  const handleDownloadErrorCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Row,unique_id,Field,Issue,Action\n' +
      errorLog.map((e) => `${e.row},"${e.unique_id}","${e.field}","${e.issue}","${e.action}"`).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dnn_import_error_log_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const progressPercent = Math.min(100, Math.round((currentBatch / totalBatches) * 100));

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Title */}
      <div className="pb-3 border-b border-[#c3c4c7]">
        <h1 className="text-xl font-normal text-[#1d2327]">Batch CSV Importer</h1>
        <p className="text-xs text-[#646970] mt-0.5">
          Chunked upsert pipeline on <code className="font-mono text-xs">unique_id</code>. Zero timeouts, zero duplicate rows.
        </p>
      </div>

      {/* 3-Step Horizontal Stepper per PRD §8.7 */}
      <div className="wp-postbox p-4">
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
          <div
            className={`py-2 rounded ${
              step === 1 ? 'bg-[#2271b1] text-white' : step > 1 ? 'bg-[#e3f0e8] text-[#00a32a]' : 'text-[#8c8f94]'
            }`}
          >
            1. Upload CSV
          </div>
          <div
            className={`py-2 rounded ${
              step === 2 ? 'bg-[#2271b1] text-white' : step > 2 ? 'bg-[#e3f0e8] text-[#00a32a]' : 'text-[#8c8f94]'
            }`}
          >
            2. Validate & Preview
          </div>
          <div
            className={`py-2 rounded ${
              step === 3 ? 'bg-[#2271b1] text-white' : 'text-[#8c8f94]'
            }`}
          >
            3. Run Import
          </div>
        </div>
      </div>

      {/* STEP 1: UPLOAD */}
      {step === 1 && (
        <div className="wp-postbox p-6 space-y-6">
          {/* Drop Zone */}
          <div className="border-2 border-dashed border-[#8c8f94] hover:border-[#2271b1] hover:bg-[#f0f6fc] rounded p-8 text-center transition-colors">
            <UploadCloud className="w-10 h-10 text-[#2271b1] mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#1d2327]">
              Drag and drop your directory CSV here, or choose a file
            </p>
            <p className="text-xs text-[#646970] mt-1">
              Supports standard UTF-8 CSVs up to 100 MB. Processed in asynchronous 1,000-row chunks.
            </p>
            <label className="mt-4 inline-block wp-button-secondary text-xs cursor-pointer">
              <span>Choose CSV File</span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile('custom');
                    setFileName(e.target.files[0].name);
                    setFileSize(`${(e.target.files[0].size / 1024).toFixed(1)} KB`);
                    setStep(2);
                  }
                }}
              />
            </label>
          </div>

          {/* Sample Files per PRD §8.7 */}
          <div className="pt-4 border-t border-[#f0f0f1]">
            <span className="text-xs font-semibold text-[#1d2327] block mb-2">
              No file handy? Run an interactive demonstration sample:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleSelectSample('master')}
                className="p-4 rounded border border-[#c3c4c7] hover:border-[#2271b1] hover:bg-[#f6f7f7] text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1d2327] group-hover:text-[#2271b1]">
                    Master File (300,000 rows)
                  </span>
                  <span className="text-[11px] font-mono text-[#646970]">84.2 MB</span>
                </div>
                <p className="text-[11.5px] text-[#646970] mt-1">
                  Runs 300 batches with live counters and injected timeout recovery at batch 117.
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleSelectSample('incremental')}
                className="p-4 rounded border border-[#c3c4c7] hover:border-[#2271b1] hover:bg-[#f6f7f7] text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-[#1d2327] group-hover:text-[#2271b1]">
                    Incremental Update (1,850 rows)
                  </span>
                  <span className="text-[11px] font-mono text-[#00a32a] font-semibold">Mutates Store</span>
                </div>
                <p className="text-[11.5px] text-[#646970] mt-1">
                  Updates Dr. Whitfield, deactivates Dr. Alvarez, inserts Dr. Hannah Okafor in UK.
                </p>
              </button>
            </div>
          </div>

          {/* Import Options (Batch size & Dry-run RE-1) */}
          <div className="pt-4 border-t border-[#f0f0f1] flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#1d2327]">Batch Size:</span>
                <select
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value) as any)}
                  className="h-7 px-2 border border-[#8c8f94] rounded bg-white"
                >
                  <option value={500}>500 rows / batch</option>
                  <option value={1000}>1,000 rows / batch (Recommended)</option>
                </select>
              </div>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDryRun}
                  onChange={(e) => setIsDryRun(e.target.checked)}
                  className="accent-[#2271b1]"
                />
                <span className="text-[#1d2327]">Dry run (validate without writing to DB)</span>
                <span className="text-[10px] bg-[#e4ecea] text-[#1f4a4f] px-1 py-0.2 rounded font-mono">RE-1</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: VALIDATE & PREVIEW */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Header Validation Table (20 columns per PRD §1.4 & §8.7) */}
          <div className="wp-postbox p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f1]">
              <div>
                <h2 className="text-sm font-semibold text-[#1d2327]">
                  CSV Column Mapping & Header Aliases
                </h2>
                <p className="text-xs text-[#646970]">
                  Detected file: <strong className="text-[#1d2327]">{fileName}</strong> ({fileSize})
                </p>
              </div>
              <span className="text-xs font-semibold text-[#00a32a] flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>All 20 Columns Verified</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
              {[
                ['unique_id', 'unique_id', 'exact'],
                ['status', 'status', 'exact'],
                ['name', 'name', 'exact'],
                ['practice_name', 'practice_name', 'exact'],
                ['address_line_1', 'address_line_1', 'exact'],
                ['city', 'city', 'exact'],
                ['state_province_region', 'state_province_region', 'exact'],
                ['postal_code', 'Zip_postal_code', 'alias'],
                ['country', 'country', 'exact'],
                ['phone', 'phone', 'exact'],
                ['email', 'email', 'exact'],
                ['website', 'website', 'exact'],
                ['photo_url', 'photo_url', 'exact'],
                ['distinguished', 'distinguished', 'exact'],
                ['about', 'about', 'exact'],
                ['facebook_url', 'facebook_url', 'exact'],
                ['instagram_url', 'instagr', 'alias'],
                ['linkedin_url', 'linkedi', 'alias'],
                ['x_url', 'x_url', 'exact'],
                ['specialty', 'specialty', 'exact'],
              ].map(([col, detected, type]) => (
                <div key={col} className="p-2 rounded bg-[#f6f7f7] border border-[#f0f0f1] flex items-center justify-between">
                  <div className="truncate mr-1">
                    <span className="font-mono font-semibold text-[#1d2327] block text-[11px] truncate">
                      {col}
                    </span>
                    <span className="text-[10px] text-[#646970] truncate block">
                      ← {detected}
                    </span>
                  </div>
                  {type === 'alias' ? (
                    <span className="text-[10px] bg-[#f6ebd6] text-[#a86a1b] px-1 py-0.5 rounded font-mono shrink-0" title="Matched by prefix alias">
                      alias ⓘ
                    </span>
                  ) : (
                    <Check className="w-3.5 h-3.5 text-[#00a32a] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5-Row Data Preview per PRD §8.7 */}
          <div className="wp-postbox p-5 space-y-3">
            <h2 className="text-sm font-semibold text-[#1d2327]">
              Sample Row Normalization Preview
            </h2>
            <p className="text-xs text-[#646970]">
              Blank <code className="font-mono">status</code> values are safely mapped to <strong>Active (default)</strong> per PRD §0.4.
            </p>

            <div className="overflow-x-auto border border-[#c3c4c7] rounded">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#f6f7f7] border-b border-[#c3c4c7]">
                  <tr>
                    <th className="p-2 font-mono">unique_id</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Status (Normalized)</th>
                    <th className="p-2">City</th>
                    <th className="p-2">Postal Code</th>
                    <th className="p-2">Distinguished</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f0f1]">
                  <tr>
                    <td className="p-2 font-mono">DNN-US-004218</td>
                    <td className="p-2 font-medium">Dr. Emily Chen, DDS</td>
                    <td className="p-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#e3f0e8] text-[#00a32a] font-semibold text-[11px]">
                        Active (default)
                      </span>
                    </td>
                    <td className="p-2">Houston, TX</td>
                    <td className="p-2 font-mono font-medium">77098</td>
                    <td className="p-2 font-semibold text-[#7d5f2e]">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">DNN-US-009482</td>
                    <td className="p-2 font-medium">Dr. Marcus Whitfield</td>
                    <td className="p-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#e3f0e8] text-[#00a32a] font-semibold text-[11px]">
                        Active (default)
                      </span>
                    </td>
                    <td className="p-2">Boston, MA</td>
                    <td className="p-2 font-mono font-medium">02108 (Leading zero intact)</td>
                    <td className="p-2 font-semibold text-[#7d5f2e]">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">DNN-UK-000774</td>
                    <td className="p-2 font-medium">Dr. Oliver Hartley</td>
                    <td className="p-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#e3f0e8] text-[#00a32a] font-semibold text-[11px]">
                        Active (default)
                      </span>
                    </td>
                    <td className="p-2">London, UK</td>
                    <td className="p-2 font-mono font-medium">W1G 9PF</td>
                    <td className="p-2 font-semibold text-[#7d5f2e]">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">DNN-CA-002091</td>
                    <td className="p-2 font-medium">Dr. Amara Singh-Lavoie</td>
                    <td className="p-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#e3f0e8] text-[#00a32a] font-semibold text-[11px]">
                        Active (default)
                      </span>
                    </td>
                    <td className="p-2">Toronto, ON</td>
                    <td className="p-2 font-mono font-medium">M5V 1K2</td>
                    <td className="p-2 font-semibold text-[#7d5f2e]">Yes</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">DNN-US-012009</td>
                    <td className="p-2 font-medium">Dr. Kevin Marsh</td>
                    <td className="p-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#f6e2df] text-[#b32d2e] font-semibold text-[11px]">
                        Inactive
                      </span>
                    </td>
                    <td className="p-2">Portland, OR</td>
                    <td className="p-2 font-mono font-medium">97205</td>
                    <td className="p-2 text-[#8c8f94]">No</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="wp-button-secondary text-xs"
              >
                Back to Upload
              </button>

              <button
                type="button"
                onClick={handleStartImport}
                className="wp-button-primary text-xs font-semibold px-4 py-1.5"
              >
                Start Ingestion Pipeline ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: RUNNING IMPORT */}
      {step === 3 && (
        <div className="space-y-5">
          {/* Timeout Alert during Failure Moment */}
          {timeoutNotice && (
            <div className="wp-notice wp-notice-warning flex items-center gap-2 text-xs animate-pulse">
              <AlertTriangle className="w-4 h-4 text-[#dba617] shrink-0" />
              <span>{timeoutNotice}</span>
            </div>
          )}

          {/* Progress Box per PRD §8.7 */}
          <div className="wp-postbox p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-[#646970]">
                  {isFinished ? 'Import Pipeline Finished' : 'Processing Batches'}
                </span>
                <div className="text-sm font-semibold text-[#1d2327] mt-0.5">
                  Batch {currentBatch} of {totalBatches} · rows{' '}
                  {((currentBatch - 1) * batchSize + 1).toLocaleString()}–
                  {Math.min(currentBatch * batchSize, selectedFile === 'master' ? 300000 : 1850).toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold font-mono text-[#2271b1]">
                  {progressPercent}%
                </span>
                <div className="text-[11px] text-[#646970]">
                  Elapsed: {elapsedSeconds}s · ~3,400 rows/sec
                </div>
              </div>
            </div>

            {/* Progress Bar with scaleX */}
            <div className="h-3 w-full bg-[#f0f0f1] rounded overflow-hidden border border-[#c3c4c7]">
              <div
                className="h-full bg-[#2271b1] transition-all duration-100 ease-out origin-left"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Live Counters Row per PRD §8.7 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded bg-[#f6f7f7] border border-[#f0f0f1] text-center">
                <span className="text-[10px] uppercase font-bold text-[#00a32a] block">Inserted</span>
                <span className="text-xl font-bold font-mono text-[#1d2327]">
                  {inserted.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded bg-[#f6f7f7] border border-[#f0f0f1] text-center">
                <span className="text-[10px] uppercase font-bold text-[#2271b1] block">Updated</span>
                <span className="text-xl font-bold font-mono text-[#1d2327]">
                  {updated.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded bg-[#f6f7f7] border border-[#f0f0f1] text-center">
                <span className="text-[10px] uppercase font-bold text-[#646970] block">Unchanged</span>
                <span className="text-xl font-bold font-mono text-[#1d2327]">
                  {unchanged.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded bg-[#f6f7f7] border border-[#f0f0f1] text-center">
                <span className="text-[10px] uppercase font-bold text-[#d63638] block">Skipped</span>
                <span className="text-xl font-bold font-mono text-[#1d2327]">
                  {skipped.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Live Log */}
            <div>
              <span className="text-[11px] font-semibold text-[#646970] block mb-1">
                Transaction Journal (Last 6 commits):
              </span>
              <div className="bg-[#1d2327] text-[#f0f0f1] font-mono text-[11.5px] p-3 rounded space-y-1 h-32 overflow-y-auto">
                {logs.map((log, i) => (
                  <div key={i} className="text-[#a7aaad]">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-[#f0f0f1]">
              {!isFinished ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPaused(!isPaused)}
                    className="wp-button-secondary text-xs flex items-center gap-1"
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{isPaused ? 'Resume Import' : 'Pause Import'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Cancel import? Already committed batches will remain safe in the database.')) {
                        setStep(1);
                      }
                    }}
                    className="text-xs text-[#b32d2e] hover:underline px-2"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="wp-button-secondary text-xs"
                  >
                    Import Another File
                  </button>

                  {errorLog.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDownloadErrorCsv}
                      className="wp-button-secondary text-xs flex items-center gap-1.5 font-semibold"
                    >
                      <Download className="w-3.5 h-3.5 text-[#2271b1]" />
                      <span>Download Error Log (.csv)</span>
                    </button>
                  )}
                </div>
              )}

              {isFinished && (
                <span className="text-xs font-semibold text-[#00a32a] flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Idempotent Upsert Complete</span>
                </span>
              )}
            </div>
          </div>

          {/* Error Log Table if errors or warnings exist per PRD §8.7 */}
          {errorLog.length > 0 && (
            <div className="wp-postbox p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f1]">
                <h3 className="text-sm font-semibold text-[#1d2327]">
                  Sanitization & Validation Journal ({errorLog.length} rows)
                </h3>

                <button
                  type="button"
                  onClick={handleDownloadErrorCsv}
                  className="text-xs text-[#2271b1] hover:underline flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>Export CSV</span>
                </button>
              </div>

              <div className="overflow-x-auto border border-[#c3c4c7] rounded">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#f6f7f7] border-b border-[#c3c4c7]">
                    <tr>
                      <th className="p-2">Row</th>
                      <th className="p-2 font-mono">unique_id</th>
                      <th className="p-2">Field</th>
                      <th className="p-2">Validation Issue</th>
                      <th className="p-2">Engine Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    {errorLog.map((err, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-mono text-[#646970]">{err.row}</td>
                        <td className="p-2 font-mono">{err.unique_id || '—'}</td>
                        <td className="p-2 font-mono">{err.field}</td>
                        <td className="p-2 text-[#50575e]">{err.issue}</td>
                        <td className="p-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                              err.action === 'Skipped'
                                ? 'bg-[#f6e2df] text-[#b32d2e]'
                                : 'bg-[#f6ebd6] text-[#a86a1b]'
                            }`}
                          >
                            {err.action}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
