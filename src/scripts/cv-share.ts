/**
 * Share modal wiring for the CV page.
 *
 * Builds a `tel`-carrying share URL from the shared phone helpers, invokes
 * `navigator.share` when available, and falls back to copying the URL to
 * the clipboard with a transient "Copied" toast. See
 * specs/005-cv-page/contracts/share-behavior.md for the full contract.
 */

import {
  isValidLocal,
  parseLocalDigits,
  toTelParam
} from './cv-phone';

interface CvShareOptions {
  triggerEl: Element | null;
  modalEl: HTMLElement | null;
  dialogEl: HTMLElement | null;
  backdropEl: Element | null;
  phoneInputEl: HTMLInputElement | null;
  submitBtnEl: HTMLButtonElement | null;
  toastEl: HTMLElement | null;
  shareTitle: string;
  shareText: string;
  shareUrl: string;
}

const MAX_LOCAL_DIGITS = 10;
const TOAST_DURATION_MS = 2200;

function buildShareUrl(baseUrl: string, localDigits: string): string {
  const url = new URL(baseUrl);
  url.search = '';
  if (isValidLocal(localDigits)) {
    url.searchParams.set('tel', toTelParam(localDigits));
  }
  return url.toString();
}

function showToast(toastEl: HTMLElement | null): void {
  if (!toastEl) return;
  toastEl.hidden = false;
  toastEl.removeAttribute('hidden');
  window.setTimeout(() => {
    toastEl.hidden = true;
    toastEl.setAttribute('hidden', '');
  }, TOAST_DURATION_MS);
}

async function copyFallback(url: string, toastEl: HTMLElement | null): Promise<void> {
  try {
    await navigator.clipboard.writeText(url);
  } catch {
    // Clipboard write can fail (permissions, insecure context); still show the toast
    // so the user knows the share URL was at least surfaced/attempted.
  }
  showToast(toastEl);
}

export function initCvShare(options: CvShareOptions): void {
  const {
    triggerEl, modalEl, dialogEl, backdropEl, phoneInputEl, submitBtnEl, toastEl,
    shareTitle, shareText, shareUrl,
  } = options;
  if (!triggerEl || !modalEl || !dialogEl || !phoneInputEl || !submitBtnEl) return;

  let lastFocused: HTMLElement | null = null;

  const openModal = () => {
    lastFocused = document.activeElement as HTMLElement | null;
    modalEl.hidden = false;
    modalEl.removeAttribute('hidden');
    phoneInputEl.value = '';
    phoneInputEl.focus();
    document.addEventListener('keydown', onKeydown);
  };

  const closeModal = () => {
    modalEl.hidden = true;
    modalEl.setAttribute('hidden', '');
    document.removeEventListener('keydown', onKeydown);
    lastFocused?.focus();
  };

  const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal();
    }
  };

  phoneInputEl.addEventListener('input', () => {
    // Restrict to digits only, max 10 local digits (country code shown separately as a prefix).
    let digits = phoneInputEl.value.replace(/\D/g, '');
    if (digits.length > MAX_LOCAL_DIGITS) digits = digits.slice(0, MAX_LOCAL_DIGITS);
    phoneInputEl.value = digits;
  });

  triggerEl.addEventListener('click', openModal);
  backdropEl?.addEventListener('click', closeModal);

  submitBtnEl.addEventListener('click', async () => {
    const digits = parseLocalDigits(phoneInputEl.value);
    const url = buildShareUrl(shareUrl, digits);
    const payload = { title: shareTitle, text: shareText, url };

    if (navigator.share) {
      try {
        await navigator.share(payload);
        closeModal();
        return;
      } catch (error) {
        if ((error as Error)?.name === 'AbortError') return;
        await copyFallback(url, toastEl);
        closeModal();
        return;
      }
    }

    await copyFallback(url, toastEl);
    closeModal();
  });
}
