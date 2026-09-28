import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useDentistStore } from '../../store/dentistStore';
import { useDemoStore } from '../../store/demoStore';
import { DentistRecord, CountryCode } from '../../types/dentist';
import { generateSlug } from '../../lib/slug';
import { DentistCard } from '../../components/domain/DentistCard';
import { CoverImage } from '../../components/domain/CoverImage';
import { wpautop } from '../../lib/wpautop';

export function EditRecord() {
  const { uid } = useParams<{ uid: string }>();
  const navigate = useNavigate();
  const isNew = !uid || uid === 'new';

  const { records, updateRecord, addRecord } = useDentistStore();
  const { completeGuideStep } = useDemoStore();

  // Find record or initialize blank
  const existingRecord = records.find((r) => r.unique_id === uid);

  const [formData, setFormData] = useState<DentistRecord>(() => {
    if (existingRecord) return { ...existingRecord };

    const newId = `DNN-US-${String(Math.floor(10000 + Math.random() * 90000))}`;
    return {
      unique_id: newId,
      status: '', // blank = Active
      name: '',
      practice_name: '',
      address_line_1: '',
      city: '',
      state_province_region: '',
      postal_code: '',
      country: 'US',
      phone: '',
      email: '',
      website: '',
      photo_url: '',
      distinguished: '',
      about: '',
      facebook_url: '',
      instagram_url: '',
      linkedin_url: '',
      x_url: '',
      specialty: 'General',
      slug: '',
    };
  });

  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPreviewFormatting, setShowPreviewFormatting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (existingRecord) {
      setFormData({ ...existingRecord });
    }
  }, [existingRecord]);

  const handleChange = (field: keyof DentistRecord, value: string) => {
    setIsDirty(true);
    setFormData((prev) => {
      const next = { ...prev, [field]: value };
      // Auto-generate slug if distinguished is toggled on or name changes
      if (field === 'name' || field === 'state_province_region') {
        if (next.distinguished === 'Yes' && next.name) {
          next.slug = generateSlug(next.name, next.state_province_region);
        }
      }
      return next;
    });

    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessNotice(false);

    // Validation
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required.';
    }
    if (formData.postal_code && formData.postal_code.length > 20) {
      errors.postal_code = 'Postal code cannot exceed 20 characters.';
    }
    if (formData.email && !formData.email.includes('@')) {
      errors.email = 'Please enter a valid email address.';
    }
    if (formData.website && !formData.website.startsWith('http')) {
      errors.website = 'Website must start with http:// or https://';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);

    // Ensure slug exists for distinguished dentists
    const finalRecord = { ...formData };
    if (finalRecord.distinguished === 'Yes' && !finalRecord.slug) {
      finalRecord.slug = generateSlug(finalRecord.name, finalRecord.state_province_region);
    }

    // Simulate saving delay (600–900ms per PRD §8.6)
    await new Promise((r) => setTimeout(r, 700));

    if (isNew) {
      addRecord(finalRecord);
    } else {
      updateRecord(finalRecord);
    }

    completeGuideStep('admin-edit');
    setSaving(false);
    setIsDirty(false);
    setSuccessNotice(true);

    setTimeout(() => setSuccessNotice(false), 6000);
  };

  const charCount = (formData.about || '').length;

  return (
    <div className="space-y-4 max-w-6xl">
      {/* Title & Back Link */}
      <div className="flex items-center justify-between pb-2 border-b border-[#c3c4c7]">
        <div className="flex items-center gap-3">
          <Link
            to="/wp-admin/records"
            className="text-xs text-[#2271b1] hover:text-[#135e96] flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Records</span>
          </Link>
          <span className="text-[#8c8f94]">/</span>
          <h1 className="text-xl font-normal text-[#1d2327]">
            {isNew ? 'Add New Dentist Record' : `Edit Record: ${formData.name || formData.unique_id}`}
          </h1>
        </div>

        {formData.distinguished === 'Yes' && formData.slug && formData.status !== 'Inactive' && (
          <Link
            to={`/dentist/${formData.slug}`}
            target="_blank"
            className="wp-button-secondary text-xs flex items-center gap-1"
          >
            <span>View Profile on Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Success Notice */}
      {successNotice && (
        <div className="wp-notice wp-notice-success flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#00a32a] shrink-0" />
          <span>
            Record updated. Changes are immediately reflected in public directory searches.
          </span>
        </div>
      )}

      {/* Error Summary Notice */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="wp-notice wp-notice-error text-xs space-y-1">
          <strong>Please fix the highlighted fields:</strong>
          <ul className="list-disc pl-5">
            {Object.entries(validationErrors).map(([key, msg]) => (
              <li key={key}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main 2-Column Form Layout per PRD §8.6 */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Main Form - 8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Panel 1: Identity */}
          <div className="wp-postbox p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#1d2327] pb-2 border-b border-[#f0f0f1]">
              1. Practitioner Identity
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                Full Name with Credentials <span className="text-[#d63638]">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g. Dr. Emily Chen, DDS"
                className={`w-full h-8 px-2.5 text-xs bg-white border rounded focus:outline-none ${
                  validationErrors.name ? 'border-[#d63638]' : 'border-[#8c8f94] focus:border-[#2271b1]'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                Clinical Specialty
              </label>
              <input
                type="text"
                list="specialty-options"
                value={formData.specialty}
                onChange={(e) => handleChange('specialty', e.target.value)}
                placeholder="e.g. General, Orthodontist, Pediatric..."
                className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none"
              />
              <datalist id="specialty-options">
                <option value="General" />
                <option value="Orthodontist" />
                <option value="Pediatric" />
                <option value="Periodontist" />
                <option value="Endodontist" />
                <option value="Prosthodontist" />
                <option value="Oral Surgeon" />
              </datalist>
            </div>
          </div>

          {/* Panel 2: Practice & Location */}
          <div className="wp-postbox p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#1d2327] pb-2 border-b border-[#f0f0f1]">
              2. Practice & Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  Practice Name
                </label>
                <input
                  type="text"
                  value={formData.practice_name}
                  onChange={(e) => handleChange('practice_name', e.target.value)}
                  placeholder="e.g. Chen Family & Cosmetic Dentistry"
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.address_line_1}
                  onChange={(e) => handleChange('address_line_1', e.target.value)}
                  placeholder="e.g. 2210 Westheimer Rd, Suite 300"
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="e.g. Houston"
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  State / Province / Region
                </label>
                <input
                  type="text"
                  value={formData.state_province_region}
                  onChange={(e) => handleChange('state_province_region', e.target.value)}
                  placeholder="e.g. TX, ON, Greater London, NSW"
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => handleChange('postal_code', e.target.value)}
                  placeholder="e.g. 02108, W1G 9PF, M5V 1K2"
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none"
                />
                <span className="text-[11px] text-[#646970] mt-0.5 block">
                  Stored as text so 02108 and W1G 9PF stay intact.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => handleChange('country', e.target.value as CountryCode)}
                  className="w-full h-8 px-2 bg-white border border-[#8c8f94] rounded text-xs focus:border-[#2271b1] focus:outline-none"
                >
                  <option value="US">United States (US)</option>
                  <option value="CA">Canada (CA)</option>
                  <option value="UK">United Kingdom (UK)</option>
                  <option value="AU">Australia (AU)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Panel 3: Contact */}
          <div className="wp-postbox p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#1d2327] pb-2 border-b border-[#f0f0f1]">
              3. Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  Phone (Plain text)
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="e.g. +1 (713) 555-0142"
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  Email (Contact destination)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="e.g. emily@chenfamilydental.example"
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://www.chenfamilydental.example"
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Panel 4: Media */}
          <div className="wp-postbox p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#1d2327] pb-2 border-b border-[#f0f0f1]">
              4. Media & Photography
            </h2>

            <div className="flex items-start gap-4">
              {/* Live 64px preview per PRD §8.6 */}
              <div className="w-16 h-16 rounded border border-[#c3c4c7] overflow-hidden bg-[#f0f0f1] shrink-0">
                <CoverImage
                  photoUrl={formData.photo_url}
                  name={formData.name || 'Dentist'}
                  specialty={formData.specialty}
                  city={formData.city}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">
                  Photo URL (or "cover" for generated digital magazine cover)
                </label>
                <input
                  type="text"
                  value={formData.photo_url}
                  onChange={(e) => handleChange('photo_url', e.target.value)}
                  placeholder='Enter image URL or "cover"'
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none"
                />
                <span className="text-[11px] text-[#646970] mt-1 block">
                  Leave blank or invalid to display the verified DNN branded placeholder.
                </span>
              </div>
            </div>
          </div>

          {/* Panel 5: Social Media */}
          <div className="wp-postbox p-5 space-y-4">
            <h2 className="text-sm font-semibold text-[#1d2327] pb-2 border-b border-[#f0f0f1]">
              5. Social Media Accounts (Optional)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">Facebook</label>
                <input
                  type="url"
                  value={formData.facebook_url}
                  onChange={(e) => handleChange('facebook_url', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">Instagram</label>
                <input
                  type="url"
                  value={formData.instagram_url}
                  onChange={(e) => handleChange('instagram_url', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => handleChange('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1d2327] mb-1">X (Twitter)</label>
                <input
                  type="url"
                  value={formData.x_url}
                  onChange={(e) => handleChange('x_url', e.target.value)}
                  placeholder="https://x.com/..."
                  className="w-full h-8 px-2.5 text-xs bg-white border border-[#8c8f94] rounded focus:border-[#2271b1]"
                />
              </div>
            </div>
          </div>

          {/* Panel 6: Editorial Biography (Distinguished) */}
          <div className="wp-postbox p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f1]">
              <h2 className="text-sm font-semibold text-[#1d2327]">
                6. Editorial Profile Biography (Distinguished Tier)
              </h2>

              <button
                type="button"
                onClick={() => setShowPreviewFormatting(!showPreviewFormatting)}
                className="text-xs text-[#2271b1] hover:underline flex items-center gap-1 font-semibold"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showPreviewFormatting ? 'Hide Preview' : 'Preview formatting'}</span>
              </button>
            </div>

            <div>
              <textarea
                rows={8}
                value={formData.about}
                onChange={(e) => handleChange('about', e.target.value)}
                placeholder="Enter editorial biography. Double line breaks will format into paragraphs via wpautop()."
                className="w-full p-2.5 text-xs font-serif bg-white border border-[#8c8f94] rounded focus:border-[#2271b1] focus:outline-none leading-relaxed"
              />

              {/* Soft Character Counter per PRD §8.6 */}
              <div className="flex items-center justify-between mt-1 text-[11px]">
                <span
                  className={
                    charCount > 4000
                      ? 'text-[#d63638] font-bold'
                      : charCount >= 3800
                      ? 'text-[#dba617] font-semibold'
                      : 'text-[#646970]'
                  }
                >
                  {charCount} / 4,000 characters
                </span>
                <span className="text-[#8c8f94]">
                  Paragraphs rendered with WordPress wpautop() formatting
                </span>
              </div>
            </div>

            {/* wpautop Formatting Preview Popover */}
            {showPreviewFormatting && (
              <div className="p-4 rounded bg-[#f6f7f7] border border-[#c3c4c7] text-xs">
                <span className="text-[10px] uppercase font-bold text-[#646970] block mb-2">
                  wpautop() Rendered Preview:
                </span>
                <div className="space-y-3 font-serif leading-relaxed text-[#1d2327]">
                  {wpautop(formData.about).map((p, i) => (
                    <p key={i} className={i === 0 ? 'text-sm font-medium' : ''}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Meta Box & RE-2 Live Mini-Preview - 4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Publish / Status Meta Box */}
          <div className="wp-postbox p-4 space-y-4">
            <h3 className="text-xs uppercase font-bold text-[#646970] pb-2 border-b border-[#f0f0f1]">
              Publish Settings
            </h3>

            {/* unique_id (read-only) */}
            <div>
              <span className="block text-[11px] text-[#646970]">unique_id</span>
              <span className="font-mono text-xs font-bold text-[#1d2327]">
                {formData.unique_id}
              </span>
            </div>

            {/* Status Segmented Control */}
            <div>
              <label className="block text-xs font-semibold text-[#1d2327] mb-1.5">
                Visibility Status
              </label>
              <div className="inline-flex w-full rounded border border-[#8c8f94] overflow-hidden text-xs">
                <button
                  type="button"
                  onClick={() => handleChange('status', 'Active')}
                  className={`flex-1 py-1.5 font-semibold text-center ${
                    formData.status !== 'Inactive'
                      ? 'bg-[#00a32a] text-white'
                      : 'bg-white text-[#50575e] hover:bg-[#f0f0f1]'
                  }`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('status', 'Inactive')}
                  className={`flex-1 py-1.5 font-semibold text-center ${
                    formData.status === 'Inactive'
                      ? 'bg-[#d63638] text-white'
                      : 'bg-white text-[#50575e] hover:bg-[#f0f0f1]'
                  }`}
                >
                  Inactive
                </button>
              </div>
              <span className="text-[11px] text-[#646970] mt-1 block">
                {formData.status === '' ? 'Blank in source — treated as Active' : ''}
              </span>
            </div>

            {/* Distinguished Toggle */}
            <div className="pt-2 border-t border-[#f0f0f1]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.distinguished === 'Yes'}
                  onChange={(e) => handleChange('distinguished', e.target.checked ? 'Yes' : '')}
                  className="accent-[#2271b1]"
                />
                <span className="text-xs font-semibold text-[#1d2327]">
                  Distinguished Dentist Tier (★)
                </span>
              </label>
            </div>

            {/* Slug field if Distinguished */}
            {formData.distinguished === 'Yes' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#1d2327] mb-1">
                  Profile URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="e.g. dr-emily-chen-tx"
                  className="w-full h-7 px-2 text-xs font-mono bg-white border border-[#8c8f94] rounded focus:border-[#2271b1]"
                />
              </div>
            )}

            {/* Save Button */}
            <div className="pt-3 border-t border-[#f0f0f1]">
              <button
                type="submit"
                disabled={saving}
                className="w-full wp-button-primary text-xs flex items-center justify-center gap-1.5 font-semibold py-1.5 h-9"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving changes...' : 'Save Record'}</span>
              </button>
            </div>
          </div>

          {/* RE-2 Live Mini-Preview Card per PRD §1.16 & §8.6 */}
          <div className="wp-postbox p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0f0f1]">
              <h3 className="text-xs uppercase font-bold text-[#646970]">
                Live Public Card Preview
              </h3>
              <span className="text-[10px] bg-[#e4ecea] text-[#1f4a4f] px-1.5 py-0.5 rounded font-mono">
                RE-2
              </span>
            </div>

            <div className="bg-[#F6F3EC] p-3 rounded">
              <DentistCard dentist={formData} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
