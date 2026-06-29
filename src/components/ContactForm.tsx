import { useState } from 'react';
import { Resend } from 'resend';

interface FormData {
  name: string;
  company: string;
  email: string;
  material: string;
  volume: string;
  port: string;
  message: string;
}

const materials = [
  'Phosphate (PHO-G3-SY)',
  'Phosphate (PHO-G4-SY)',
  'Phosphate (PHO-OCP-MA)',
  'DAP Fertilizer',
  'Sulphur Granulated',
  'Limestone Technical',
  'Other',
];

const ports = [
  'Augusta (Italy)',
  'Hamburg (Germany)',
  'Rotterdam (Netherlands)',
  'Antwerp (Belgium)',
  'Barcelona (Spain)',
  'Other EU Port',
];

export default function ContactForm({ lang = 'en' }: { lang?: string }) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    company: '',
    email: '',
    material: '',
    volume: '',
    port: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const labels = {
    en: {
      name: 'Full Name',
      company: 'Company',
      email: 'Email Address',
      material: 'Material',
      volume: 'Volume (MT)',
      port: 'Target Port',
      message: 'Message',
      submit: 'Send Inquiry',
      sending: 'Sending...',
      success: 'Thank you! We will respond within 1 business day.',
      error: 'Something went wrong. Please try again.',
      required: 'This field is required',
      selectMaterial: 'Select material',
      selectPort: 'Select port',
    },
    de: {
      name: 'Vollständiger Name',
      company: 'Unternehmen',
      email: 'E-Mail-Adresse',
      material: 'Material',
      volume: 'Volumen (MT)',
      port: 'Zielhafen',
      message: 'Nachricht',
      submit: 'Anfrage senden',
      sending: 'Wird gesendet...',
      success: 'Danke! Wir antworten innerhalb eines Arbeitstages.',
      error: 'Etwas ist schief gelaufen. Bitte erneut versuchen.',
      required: 'Dieses Feld ist erforderlich',
      selectMaterial: 'Material auswählen',
      selectPort: 'Hafen auswählen',
    },
    it: {
      name: 'Nome Completo',
      company: 'Azienda',
      email: 'Indirizzo Email',
      material: 'Materiale',
      volume: 'Volume (MT)',
      port: 'Porto Target',
      message: 'Messaggio',
      submit: 'Invia Richiesta',
      sending: 'Invio in corso...',
      success: 'Grazie! Risponderemo entro un giorno lavorativo.',
      error: 'Qualcosa è andato storto. Riprova.',
      required: 'Questo campo è obbligatorio',
      selectMaterial: 'Seleziona materiale',
      selectPort: 'Seleziona porto',
    },
    es: {
      name: 'Nombre Completo',
      company: 'Empresa',
      email: 'Dirección de Email',
      material: 'Material',
      volume: 'Volumen (MT)',
      port: 'Puerto Objetivo',
      message: 'Mensaje',
      submit: 'Enviar Solicitud',
      sending: 'Enviando...',
      success: '¡Gracias! Responderemos dentro de un día hábil.',
      error: 'Algo salió mal. Por favor intenta de nuevo.',
      required: 'Este campo es requerido',
      selectMaterial: 'Seleccionar material',
      selectPort: 'Seleccionar puerto',
    },
    fr: {
      name: 'Nom Complet',
      company: 'Entreprise',
      email: 'Adresse Email',
      material: 'Matériau',
      volume: 'Volume (MT)',
      port: 'Port Cible',
      message: 'Message',
      submit: 'Envoyer la Demande',
      sending: 'Envoi en cours...',
      success: 'Merci! Nous répondrons dans un jour ouvrable.',
      error: 'Quelque chose a mal tourné. Veuillez réessayer.',
      required: 'Ce champ est requis',
      selectMaterial: 'Sélectionner matériau',
      selectPort: 'Sélectionner port',
    },
  };

  const t = labels[lang as keyof typeof labels] || labels.en;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/send-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }),
      });

      if (!res.ok) throw new Error('Failed to send');
      
      setStatus('success');
      setFormData({ name: '', company: '', email: '', material: '', volume: '', port: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(t.error);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-green-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-green-800 font-medium">{t.success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.name} *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.company} *</label>
          <input
            type="text"
            required
            value={formData.company}
            onChange={e => handleChange('company', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.email} *</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={e => handleChange('email', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.material} *</label>
          <select
            required
            value={formData.material}
            onChange={e => handleChange('material', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{t.selectMaterial}</option>
            {materials.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t.volume} *</label>
          <input
            type="number"
            required
            min="10000"
            placeholder="Min. 10,000 MT"
            value={formData.volume}
            onChange={e => handleChange('volume', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.port} *</label>
        <select
          required
          value={formData.port}
          onChange={e => handleChange('port', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">{t.selectPort}</option>
          {ports.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t.message}</label>
        <textarea
          rows={4}
          value={formData.message}
          onChange={e => handleChange('message', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {status === 'loading' ? t.sending : t.submit}
      </button>
    </form>
  );
}