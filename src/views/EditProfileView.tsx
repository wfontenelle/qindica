import React, { useState, useEffect } from 'react';
import { Camera, Plus, X, ArrowRight, Check, Tag, MessageCircle, ShieldCheck, MapPin, Navigation, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { POPULAR_TAGS } from '../data/seedData';
import { formatCep, cleanCep, fetchAddressByCep, getBrowserGeolocation } from '../utils/geo';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'
];

export const EditProfileView: React.FC = () => {
  const { currentUser, updateCurrentUser, navigate, showToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [whatsapp, setWhatsapp] = useState<boolean>(currentUser.whatsapp !== false);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [presentationText, setPresentationText] = useState(currentUser.presentationText || '');
  const [photo, setPhoto] = useState(currentUser.photo || AVATAR_PRESETS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(currentUser.tags || []);
  const [customTagInput, setCustomTagInput] = useState('');

  // Geolocation & Address fields
  const [cep, setCep] = useState(currentUser.cep || '');
  const [street, setStreet] = useState(currentUser.street || '');
  const [neighborhood, setNeighborhood] = useState(currentUser.neighborhood || '');
  const [city, setCity] = useState(currentUser.city || '');
  const [state, setState] = useState(currentUser.state || '');
  const [latitude, setLatitude] = useState<number | undefined>(currentUser.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(currentUser.longitude);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [isLoadingGps, setIsLoadingGps] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state if currentUser changes from Firestore load
  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email || '');
    setPhone(currentUser.phone || '');
    setWhatsapp(currentUser.whatsapp !== false);
    setBio(currentUser.bio || '');
    setPresentationText(currentUser.presentationText || '');
    if (currentUser.photo) setPhoto(currentUser.photo);
    if (currentUser.tags) setSelectedTags(currentUser.tags);
    if (currentUser.cep) setCep(currentUser.cep);
    if (currentUser.street) setStreet(currentUser.street);
    if (currentUser.neighborhood) setNeighborhood(currentUser.neighborhood);
    if (currentUser.city) setCity(currentUser.city);
    if (currentUser.state) setState(currentUser.state);
    if (currentUser.latitude !== undefined) setLatitude(currentUser.latitude);
    if (currentUser.longitude !== undefined) setLongitude(currentUser.longitude);
  }, [currentUser.id]);

  const handleCepChange = async (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    setCepError(null);

    const cleaned = cleanCep(formatted);
    if (cleaned.length === 8) {
      setIsLoadingCep(true);
      try {
        const address = await fetchAddressByCep(cleaned);
        if (address) {
          if (address.city) setCity(address.city);
          if (address.state) setState(address.state);
          if (address.neighborhood) setNeighborhood(address.neighborhood);
          if (address.street) setStreet(address.street);
          setLatitude(address.latitude);
          setLongitude(address.longitude);
          setCepError(null);
          showToast(`CEP identificado: ${address.neighborhood ? `${address.neighborhood}, ` : ''}${address.city} - ${address.state}`);
        } else {
          setCepError('CEP não localizado. Verifique se digitou corretamente.');
        }
      } catch (err) {
        console.error(err);
        setCepError('Erro ao consultar CEP. Tente novamente.');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleManualCepSearch = async () => {
    const cleaned = cleanCep(cep);
    if (cleaned.length !== 8) {
      setCepError('Digite um CEP válido com 8 dígitos.');
      return;
    }
    setIsLoadingCep(true);
    setCepError(null);
    try {
      const address = await fetchAddressByCep(cleaned);
      if (address) {
        if (address.city) setCity(address.city);
        if (address.state) setState(address.state);
        if (address.neighborhood) setNeighborhood(address.neighborhood);
        if (address.street) setStreet(address.street);
        setLatitude(address.latitude);
        setLongitude(address.longitude);
        showToast(`Localização encontrada: ${address.city} - ${address.state}`);
      } else {
        setCepError('CEP não encontrado. Preencha a cidade manualmente se preferir.');
      }
    } catch {
      setCepError('Falha ao consultar serviço de CEP.');
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleGpsLocation = async () => {
    setIsLoadingGps(true);
    try {
      const coords = await getBrowserGeolocation();
      setLatitude(coords.latitude);
      setLongitude(coords.longitude);
      showToast('Coordenadas GPS obtidas com sucesso! 📍');
    } catch (err) {
      console.error(err);
      showToast('Não foi possível obter GPS. Verifique a permissão do seu navegador.');
    } finally {
      setIsLoadingGps(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t.toLowerCase() !== tag.toLowerCase()));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter((t) => t.toLowerCase() !== tagToRemove.toLowerCase()));
  };

  const handleAddCustomTag = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const raw = customTagInput.trim();
    if (!raw) return;

    // Split by comma or semicolon in case user typed multiple tags: "Arquiteto, Design, Reformas"
    const tagsToAdd = raw
      .split(/[,;]+/)
      .map((t) => t.trim().replace(/^#+/, ''))
      .filter((t) => t.length > 0);

    if (tagsToAdd.length === 0) return;

    const newTags = [...selectedTags];
    let addedCount = 0;

    tagsToAdd.forEach((t) => {
      const formatted = t.charAt(0).toUpperCase() + t.slice(1);
      const exists = newTags.some(
        (existing) => existing.toLowerCase() === formatted.toLowerCase()
      );
      if (!exists) {
        newTags.push(formatted);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setSelectedTags(newTags);
      setCustomTagInput('');
      showToast(
        addedCount === 1
          ? `Tag "${tagsToAdd[0]}" adicionada! 🎉`
          : `${addedCount} tags adicionadas! 🎉`
      );
    } else {
      showToast(`A tag já está na sua lista!`);
      setCustomTagInput('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setPhoto(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalLat = latitude;
    let finalLng = longitude;
    const cleanC = cleanCep(cep);

    // If CEP is typed and 8 digits but coords not resolved yet, fetch now
    if (cleanC.length === 8 && (finalLat == null || finalLng == null)) {
      try {
        const address = await fetchAddressByCep(cleanC);
        if (address) {
          finalLat = address.latitude;
          finalLng = address.longitude;
        }
      } catch (err) {
        console.error('Error fetching cep on submit:', err);
      }
    }

    await updateCurrentUser({
      name: name.trim() || 'Usuário Qindica',
      email: email.trim(),
      phone: phone.trim(),
      whatsapp,
      bio: bio.trim(),
      presentationText: presentationText.trim(),
      photo,
      tags: selectedTags,
      cep: cleanC ? formatCep(cep) : '',
      street: street.trim(),
      neighborhood: neighborhood.trim(),
      city: city.trim(),
      state: state.trim().toUpperCase(),
      latitude: finalLat,
      longitude: finalLng,
    });

    setIsSubmitting(false);
    showToast('Perfil e localização salvos com sucesso!');
    navigate({ name: 'profile-me' });
  };

  return (
    <div className="flex flex-col min-h-full pb-10">
      {/* Header */}
      <div className="bg-white dark:bg-[#18181C] rounded-xl p-5 sm:p-6 shadow-xs border border-neutral-200/80 dark:border-neutral-800 mb-5 transition-colors">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Editar meu perfil
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Atualize seus dados públicos, foto, competências e apresentação na rede Qindica.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left Column on Desktop (Avatar + Contact info) */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-4">
            {/* Photo Upload Area */}
            <div className="bg-white dark:bg-[#18181C] rounded-lg p-5 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col items-center transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-3 self-start">
                Foto do perfil
              </label>

              <div className="relative group cursor-pointer my-2">
                <div className="w-28 h-28 rounded-lg overflow-hidden shadow-md ring-4 ring-[#7B2FFF]/15 dark:ring-[#7B2FFF]/25 bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={photo}
                    alt="Foto de perfil"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <label
                  htmlFor="photo-upload-input"
                  className="absolute -bottom-2 -right-2 bg-[#7B2FFF] text-white p-2.5 rounded-full shadow-md hover:bg-[#6A23E3] cursor-pointer active:scale-95 transition-all border-2 border-white dark:border-[#18181C]"
                >
                  <Camera size={16} strokeWidth={2.5} />
                  <input
                    id="photo-upload-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Quick preset selector */}
              <div className="mt-3 w-full">
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-semibold block mb-1.5 text-center">
                  Ou escolha um avatar rápido:
                </span>
                <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setPhoto(url)}
                      className={`w-8 h-8 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                        photo === url
                          ? 'border-[#7B2FFF] scale-110 shadow-xs'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Details Inputs */}
            <div className="bg-white dark:bg-[#18181C] rounded-lg p-5 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col gap-3.5 transition-colors">
              <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                Contato
              </label>

              {/* E-mail */}
              <div>
                <label
                  htmlFor="edit-email-input"
                  className="block text-xs font-bold text-neutral-600 dark:text-neutral-300 mb-1"
                >
                  E-mail
                </label>
                <input
                  id="edit-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
                />
              </div>

              {/* Número de telefone */}
              <div>
                <label
                  htmlFor="edit-phone-input"
                  className="block text-xs font-bold text-neutral-600 dark:text-neutral-300 mb-1"
                >
                  Telefone / WhatsApp
                </label>
                <input
                  id="edit-phone-input"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+55 11 98765-4321"
                  className="w-full px-3.5 py-2 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
                />

                {/* Checkbox WhatsApp */}
                <div
                  onClick={() => setWhatsapp(!whatsapp)}
                  className="mt-2.5 flex items-start gap-2.5 p-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/80 dark:border-neutral-700/60 cursor-pointer hover:bg-neutral-100/70 dark:hover:bg-neutral-800 transition-colors"
                >
                  <input
                    id="edit-whatsapp-checkbox"
                    type="checkbox"
                    checked={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.checked)}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0.5 w-4 h-4 rounded text-[#25D366] focus:ring-[#25D366] accent-[#25D366] cursor-pointer"
                  />
                  <label
                    htmlFor="edit-whatsapp-checkbox"
                    className="text-xs text-neutral-700 dark:text-neutral-300 font-medium cursor-pointer leading-tight"
                  >
                    <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <MessageCircle size={13} className="text-[#25D366]" />
                      Exibir botão de WhatsApp no perfil
                    </span>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block mt-0.5">
                      Permite que visitantes iniciem conversa direta com você. Desmarque para pausar contatos.
                    </span>
                  </label>
                </div>

                {/* Nota de privacidade e proteção anti-spam */}
                <div className="mt-3 p-3 rounded-md bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-2.5 text-[11px] text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="leading-snug">
                    <span className="font-bold block text-emerald-900 dark:text-emerald-200">
                      Privacidade & Proteção Anti-Spam
                    </span>
                    Seu número não é exposto a robôs de raspagem. Seus dados têm finalidade estritamente profissional para receber clientes e indicações.
                  </div>
                </div>
              </div>
            </div>

            {/* Localização & CEP Card */}
            <div className="bg-white dark:bg-[#18181C] rounded-lg p-5 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col gap-3.5 transition-colors">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-1 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#7B2FFF]" />
                  Localização & CEP
                </label>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-snug">
                  O CEP conecta pessoas próximas geograficamente e permite ordenar por proximidade.
                </p>
              </div>

              {/* Campo CEP */}
              <div>
                <label
                  htmlFor="edit-cep-input"
                  className="block text-xs font-bold text-neutral-600 dark:text-neutral-300 mb-1"
                >
                  CEP (Código Postal)
                </label>
                <div className="relative flex items-center">
                  <input
                    id="edit-cep-input"
                    type="text"
                    maxLength={9}
                    value={cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                    placeholder="00000-000"
                    className="w-full px-3.5 py-2 pr-10 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
                  />
                  <div className="absolute right-2.5 flex items-center">
                    {isLoadingCep ? (
                      <Loader2 size={16} className="text-[#7B2FFF] animate-spin" />
                    ) : cleanCep(cep).length === 8 ? (
                      <CheckCircle2 size={16} className="text-emerald-500" />
                    ) : null}
                  </div>
                </div>

                {cepError && (
                  <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-1 font-medium">
                    <AlertCircle size={12} className="shrink-0" />
                    {cepError}
                  </p>
                )}
              </div>

              {/* Botão GPS */}
              <button
                type="button"
                onClick={handleGpsLocation}
                disabled={isLoadingGps}
                className="w-full py-2 px-3 rounded-md border border-neutral-200 dark:border-neutral-700 hover:border-[#7B2FFF] dark:hover:border-[#7B2FFF] bg-neutral-50 dark:bg-neutral-800/60 hover:bg-[#7B2FFF]/5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {isLoadingGps ? (
                  <>
                    <Loader2 size={13} className="animate-spin text-[#7B2FFF]" />
                    <span>Detectando sinal GPS...</span>
                  </>
                ) : (
                  <>
                    <Navigation size={13} className="text-[#7B2FFF]" />
                    <span>Usar meu GPS atual</span>
                  </>
                )}
              </button>

              {/* Endereço preenchido automaticamente */}
              {(city || state || neighborhood) && (
                <div className="p-3 rounded-md bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/70 dark:border-neutral-700/60 flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Região identificada
                    </span>
                    {latitude != null && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md">
                        Geolocalizado
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-100 font-semibold">
                    <MapPin size={13} className="text-[#7B2FFF] shrink-0" />
                    <span className="truncate">
                      {neighborhood ? `${neighborhood}, ` : ''}{city} - {state}
                    </span>
                  </div>

                  {street && (
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {street}
                    </p>
                  )}
                </div>
              )}

              {/* Campos complementares editáveis */}
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-0.5">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Cidade"
                    className="w-full px-2.5 py-1.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-0.5">
                    UF
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    placeholder="SP"
                    className="w-full px-2.5 py-1.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white uppercase text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-600 dark:text-neutral-400 mb-0.5">
                  Bairro
                </label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Bairro"
                  className="w-full px-2.5 py-1.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Right Column on Desktop (Name, Bio, Tags, Presentation) */}
          <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-4">
            {/* Basic Information Inputs */}
            <div className="bg-white dark:bg-[#18181C] rounded-lg p-5 sm:p-6 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col gap-4 transition-colors">
              {/* Nome */}
              <div>
                <label
                  htmlFor="edit-name-input"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5"
                >
                  Nome completo
                </label>
                <input
                  id="edit-name-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  className="w-full px-4 py-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
                />
              </div>

              {/* Recado (Short bio) */}
              <div>
                <label
                  htmlFor="edit-bio-input"
                  className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1.5"
                >
                  Recado / Cargo curto
                </label>
                <input
                  id="edit-bio-input"
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ex: Designer de Produto & Estrategista"
                  maxLength={80}
                  className="w-full px-4 py-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all"
                />
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 block text-right">
                  {bio.length}/80 caracteres
                </span>
              </div>
            </div>

            {/* Tags Selection Area */}
            <div className="bg-white dark:bg-[#18181C] rounded-lg p-5 sm:p-6 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col transition-colors">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Tags & Especialidades
                </label>
                <span className="text-[11px] font-bold text-[#7B2FFF] dark:text-[#a068ff] bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 px-2 py-0.5 rounded-md">
                  {selectedTags.length} selecionada{selectedTags.length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-3.5">
                Selecione as palavras-chave pelas quais você quer ser encontrado e indicado.
              </p>

              {/* Currently Selected Active Tags */}
              {selectedTags.length > 0 && (
                <div className="mb-4 p-3.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-md border border-neutral-200/70 dark:border-neutral-700/60">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-2">
                    Suas tags ativas:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-md bg-[#7B2FFF] text-white text-xs font-bold shadow-xs transition-all animate-in fade-in zoom-in-95"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="w-4 h-4 rounded bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition-colors cursor-pointer"
                          aria-label={`Remover tag ${tag}`}
                        >
                          <X size={11} strokeWidth={3} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Suggestions */}
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-2">
                Sugestões populares (clique para adicionar ou remover):
              </span>
              <div className="flex flex-wrap gap-2 mb-4">
                {POPULAR_TAGS.map((tag) => {
                  const isActive = selectedTags.some(
                    (t) => t.toLowerCase() === tag.toLowerCase()
                  );
                  return (
                    <button
                      type="button"
                      key={tag}
                      id={`tag-toggle-${tag.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#7B2FFF] text-white shadow-xs'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                      }`}
                    >
                      {isActive ? (
                        <Check size={13} strokeWidth={3} />
                      ) : (
                        <Plus size={13} strokeWidth={2.5} className="text-neutral-400 dark:text-neutral-500" />
                      )}
                      <span>{tag}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add custom tag input */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-2">
                  Criar nova tag personalizada:
                </span>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none"
                    />
                    <input
                      id="custom-tag-input"
                      type="text"
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomTag();
                        }
                      }}
                      placeholder="Ex: Consultoria de Vendas, Copywriting, Finanças..."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    id="add-custom-tag-btn"
                    onClick={() => handleAddCustomTag()}
                    className="px-4 py-2.5 rounded-md bg-[#7B2FFF] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-[#6A23E3] active:scale-95 shadow-xs transition-all cursor-pointer"
                  >
                    <Plus size={14} strokeWidth={2.5} />
                    <span>Adicionar Tag</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Texto de apresentação */}
            <div className="bg-white dark:bg-[#18181C] rounded-lg p-5 sm:p-6 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col transition-colors">
              <label
                htmlFor="edit-presentation-input"
                className="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-1"
              >
                Texto de apresentação
              </label>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-2.5">
                Conte sua trajetória, histórico, projetos marcantes e detalhes do seu trabalho.
              </p>
              <textarea
                id="edit-presentation-input"
                rows={5}
                value={presentationText}
                onChange={(e) => setPresentationText(e.target.value)}
                placeholder="Escreva sua apresentação detalhada aqui..."
                className="w-full px-4 py-3 rounded-md bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#7B2FFF] focus:border-transparent transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="submit-edit-profile-btn"
                className="w-full py-3.5 px-6 rounded-lg bg-[#7B2FFF] hover:bg-[#6A23E3] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#7B2FFF]/20 transition-all cursor-pointer"
              >
                <span>Salvar alterações no perfil →</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
