import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  MessageCircle,
  ExternalLink,
  UserPlus,
  Star,
  Sparkles,
  UserCheck,
  Award,
  LogIn,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { getProfileShareUrl, getInviteUrl } from '../utils/routes';

interface ShareProfileViewProps {
  userId?: string;
  initialTab?: 'invite' | 'profile';
}

export const ShareProfileView: React.FC<ShareProfileViewProps> = ({
  userId,
  initialTab = 'invite',
}) => {
  const { currentUser, getUserById, showToast, navigate, isAuthenticated, openAuthModal } = useApp();
  const [activeTab, setActiveTab] = useState<'invite' | 'profile'>(initialTab);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [copiedProfile, setCopiedProfile] = useState(false);

  // If user is not authenticated and is trying to access their personal share screen
  if (!userId && !isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#7B2FFF]/10 text-[#7B2FFF] flex items-center justify-center mb-5">
          <Share2 size={30} />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-2">
          Acesse sua conta para compartilhar
        </h2>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">
          Entre ou crie seu perfil no Qindica para gerar seu link de convite oficial com +1 estrela de recomendação e compartilhar sua página profissional.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => openAuthModal('login')}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#7B2FFF] hover:bg-[#6A23E3] text-white font-bold text-xs sm:text-sm transition-all shadow-sm active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn size={15} />
            <span>Entrar na minha conta</span>
          </button>
          <button
            onClick={() => navigate({ name: 'home' })}
            className="flex-1 py-2.5 px-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  const user = userId ? getUserById(userId) || currentUser : currentUser;
  const isMe = user.id === currentUser.id;

  const inviteUrl = getInviteUrl(user.id);
  const shareUrl = getProfileShareUrl(user.id);

  const handleCopyInvite = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(inviteUrl);
      }
      setCopiedInvite(true);
      showToast('Link de convite copiado para a área de transferência! 📋');
      setTimeout(() => setCopiedInvite(false), 3000);
    } catch {
      showToast('Link: ' + inviteUrl);
    }
  };

  const handleCopyProfile = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setCopiedProfile(true);
      showToast('Link do perfil copiado para a área de transferência! 📋');
      setTimeout(() => setCopiedProfile(false), 3000);
    } catch {
      showToast('Link: ' + shareUrl);
    }
  };

  const handleNativeShareInvite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Convite para fazer parte do Qindica`,
          text: `Olá! Estou te convidando para fazer parte do Qindica, a rede de recomendações de confiança. Ao criar sua conta pelo meu convite, nos conectamos em 1º grau e você me fortalece com +1 estrela:`,
          url: inviteUrl,
        });
        showToast('Convite compartilhado com sucesso!');
        return;
      } catch {
        // Fallback to copy
      }
    }
    handleCopyInvite();
  };

  const handleNativeShareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.name} no Qindica`,
          text: `Confira o perfil e as recomendações de ${user.name} na rede Qindica:`,
          url: shareUrl,
        });
        showToast('Perfil compartilhado com sucesso!');
        return;
      } catch {
        // Fallback to copy
      }
    }
    handleCopyProfile();
  };

  const inviteWhatsAppText = encodeURIComponent(
    `Olá! Estou te convidando para fazer parte do *Qindica*, a rede onde amigos e clientes recomendam profissionais de confiança.\n\nCadastre-se pelo meu link de convite oficial para nos conectarmos diretamente em 1º grau (e você me fortalece com +1 estrela de recomendação):\n${inviteUrl}`
  );
  const inviteWhatsAppUrl = `https://api.whatsapp.com/send?text=${inviteWhatsAppText}`;

  const profileWhatsAppText = encodeURIComponent(
    `Olá! Veja meu perfil profissional e minha rede de recomendações no *Qindica*:\n${shareUrl}`
  );
  const profileWhatsAppUrl = `https://api.whatsapp.com/send?text=${profileWhatsAppText}`;

  return (
    <div className="flex flex-col min-h-full pb-10">
      {/* View Header & Tab Switcher */}
      <div className="bg-white dark:bg-[#18181C] rounded-xl p-4 sm:p-5 shadow-xs border border-neutral-200/80 dark:border-neutral-800 mb-5 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{activeTab === 'invite' ? 'Convidar para fazer parte' : 'Compartilhar perfil'}</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Star size={12} className="fill-amber-400 text-amber-500" />
                +1 Estrela no cadastro
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              {activeTab === 'invite'
                ? 'Convide amigos para fazer parte da rede. Quando seu convidado criar a conta pelo seu link ou QR Code, vocês se conectam em 1º grau e você ganha +1 estrela de recomendação!'
                : 'Compartilhe seu cartão de visitas digital com foto, serviços e recomendações de confiança.'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg border border-neutral-200/80 dark:border-neutral-700/80 self-start md:self-auto shrink-0">
            <button
              id="tab-invite-btn"
              type="button"
              onClick={() => setActiveTab('invite')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'invite'
                  ? 'bg-white dark:bg-neutral-900 text-[#7B2FFF] dark:text-[#a068ff] shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <UserPlus size={14} />
              <span>Convidar para a rede</span>
            </button>
            <button
              id="tab-profile-btn"
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-neutral-900 text-[#7B2FFF] dark:text-[#a068ff] shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <UserCheck size={14} />
              <span>Meu perfil</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content depending on Active Tab */}
      {activeTab === 'invite' ? (
        /* TAB 1: CONVIDAR ALGUÉM PARA FAZER PARTE */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left Column: Invite Explanation & Action Links */}
          <div className="md:col-span-6 flex flex-col gap-4">
            {/* VIP Inviter Preview Card */}
            <div className="w-full bg-white dark:bg-[#18181C] rounded-xl p-4 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3.5 transition-colors">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xs ring-2 ring-[#7B2FFF]/30 bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate">
                    {user.name}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 text-[#7B2FFF] dark:text-[#a068ff]">
                    Anfitrião
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                  Convite oficial para entrar na rede Qindica
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[11px] font-semibold text-[#7B2FFF] dark:text-[#a068ff] bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Star size={11} className="fill-[#7B2FFF] dark:fill-[#a068ff]" />
                    {user.indicationCount} {user.indicationCount === 1 ? 'estrela atual' : 'estrelas atuais'}
                  </span>
                </div>
              </div>
            </div>

            {/* How It Works Explanatory Card */}
            <div className="bg-gradient-to-br from-[#7B2FFF]/5 via-purple-500/5 to-transparent dark:from-[#7B2FFF]/15 dark:to-transparent rounded-xl p-4 sm:p-5 border border-[#7B2FFF]/20 flex flex-col gap-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B2FFF] dark:text-[#a068ff] flex items-center gap-1.5">
                <Sparkles size={14} />
                Como funciona o convite Qindica
              </h4>
              <ul className="text-xs space-y-2 text-neutral-700 dark:text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#7B2FFF]/15 dark:bg-[#7B2FFF]/30 text-[#7B2FFF] dark:text-[#a068ff] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <span>
                    Seu amigo <strong>escaneia o QR Code</strong> ao lado ou acessa seu link de convite.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#7B2FFF]/15 dark:bg-[#7B2FFF]/30 text-[#7B2FFF] dark:text-[#a068ff] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <span>
                    Ele conclui o <strong>cadastro gratuito</strong> e entra na comunidade Qindica.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#7B2FFF]/15 dark:bg-[#7B2FFF]/30 text-[#7B2FFF] dark:text-[#a068ff] font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <span>
                    Vocês se conectam como <strong>conexão de 1º grau</strong> e você <strong>ganha +1 estrela de recomendação</strong>!
                  </span>
                </li>
              </ul>
            </div>

            {/* Invite Link Actions */}
            <div className="w-full bg-white dark:bg-[#18181C] rounded-xl p-4 sm:p-5 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col gap-3 transition-colors">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
                Seu link de convite para fazer parte
              </h3>

              <div className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-800/70 rounded-lg border border-neutral-200/70 dark:border-neutral-700/60">
                <span className="text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate flex-1 pl-1 select-all">
                  {inviteUrl}
                </span>
                <button
                  id="copy-invite-link-btn"
                  onClick={handleCopyInvite}
                  className="px-3 py-1.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {copiedInvite ? (
                    <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy size={13} />
                  )}
                  <span>{copiedInvite ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* WhatsApp Invite Button */}
              <a
                id="share-invite-whatsapp-btn"
                href={inviteWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <MessageCircle size={16} className="fill-white/20" />
                <span>Enviar convite pelo WhatsApp</span>
              </a>

              {/* Native Share */}
              <button
                id="share-invite-native-btn"
                onClick={handleNativeShareInvite}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7B2FFF] hover:bg-[#6A23E3] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Share2 size={15} strokeWidth={2.4} />
                <span>Outras opções de compartilhamento</span>
              </button>
            </div>
          </div>

          {/* Right Column: QR Code Dedicated for Joining */}
          <div className="md:col-span-6">
            <div className="w-full bg-white dark:bg-[#18181C] rounded-xl p-5 sm:p-6 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col items-center justify-center text-center transition-colors">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 text-[#7B2FFF] dark:text-[#a068ff] text-xs font-bold mb-1">
                <QrCode size={14} />
                <span>QR Code para Fazer Parte</span>
              </div>
              <p className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 mb-3">
                ⭐ Ganhe +1 estrela quando seu convidado se cadastrar pelo código!
              </p>

              <QRCodeDisplay value={inviteUrl} size={210} showDownload />

              <div className="mt-4 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-lg border border-neutral-200/60 dark:border-neutral-700/60 max-w-xs text-left">
                <p className="text-xs text-neutral-700 dark:text-neutral-300 font-medium leading-relaxed">
                  📱 <strong>Na prática:</strong> Mostre este QR Code no seu celular para um colega ou cliente. Ele aponta a câmera, cadastra-se no Qindica, vocês se conectam em 1º grau e você ganha +1 estrela!
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 2: COMPARTILHAR MEU PERFIL PROFISSIONAL */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Left Column: Profile Card Preview & Share Buttons */}
          <div className="md:col-span-6 flex flex-col gap-4">
            {/* User Card Preview */}
            <div className="w-full bg-white dark:bg-[#18181C] rounded-xl p-4 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex items-center gap-3.5 transition-colors">
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xs ring-1 ring-[#7B2FFF]/20 bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={user.photo}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate">
                  {user.name}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                  {user.bio}
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[11px] font-semibold text-[#7B2FFF] dark:text-[#a068ff] bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Star size={11} className="fill-[#7B2FFF] dark:fill-[#a068ff]" />
                    {user.indicationCount} {user.indicationCount === 1 ? 'indicação' : 'indicações'}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Share Actions */}
            <div className="w-full bg-white dark:bg-[#18181C] rounded-xl p-4 sm:p-5 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col gap-3 transition-colors">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-0.5">
                Link direto do perfil profissional
              </h3>

              <div className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-800/70 rounded-lg border border-neutral-200/70 dark:border-neutral-700/60">
                <span className="text-xs font-mono text-neutral-700 dark:text-neutral-300 truncate flex-1 pl-1 select-all">
                  {shareUrl}
                </span>
                <button
                  id="copy-profile-link-btn"
                  onClick={handleCopyProfile}
                  className="px-3 py-1.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  {copiedProfile ? (
                    <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy size={13} />
                  )}
                  <span>{copiedProfile ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>

              {/* WhatsApp Share Button */}
              <a
                id="share-profile-whatsapp-btn"
                href={profileWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] active:scale-[0.98] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <MessageCircle size={16} className="fill-white/20" />
                <span>Enviar perfil pelo WhatsApp</span>
              </a>

              {/* Native Share */}
              <button
                id="share-profile-native-btn"
                onClick={handleNativeShareProfile}
                className="w-full py-2.5 px-4 rounded-xl bg-[#7B2FFF] hover:bg-[#6A23E3] active:scale-[0.98] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Share2 size={15} strokeWidth={2.4} />
                <span>Outras opções de compartilhamento</span>
              </button>

              {/* Preview Button */}
              <button
                id="preview-profile-view-btn"
                onClick={() => navigate({ name: 'profile', userId: user.id })}
                className="w-full py-2 px-3 rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700"
              >
                <ExternalLink size={13} />
                <span>Visualizar perfil como visitante</span>
              </button>
            </div>
          </div>

          {/* Right Column: QR Code for Profile */}
          <div className="md:col-span-6">
            <div className="w-full bg-white dark:bg-[#18181C] rounded-xl p-5 sm:p-6 shadow-xs border border-neutral-200/80 dark:border-neutral-800 flex flex-col items-center justify-center text-center transition-colors">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#7B2FFF]/10 dark:bg-[#7B2FFF]/20 text-[#7B2FFF] dark:text-[#a068ff] text-xs font-bold mb-3">
                <QrCode size={13} />
                <span>QR Code do Perfil Profissional</span>
              </div>

              <QRCodeDisplay value={shareUrl} size={200} showDownload />

              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-3 max-w-xs leading-relaxed">
                Aponte a câmera do celular no QR Code: ele abre diretamente a página de recomendações e contatos de <span className="font-semibold text-neutral-700 dark:text-neutral-300">{user.name}</span>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
