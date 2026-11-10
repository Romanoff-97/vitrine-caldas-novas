import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'linkify',
  standalone: true
})
export class LinkifyPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value?: string | null): SafeHtml {
    if (!value) return '';

    // 1. Escapa tags HTML para garantir total segurança contra XSS
    const escapado = value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // 2. Regex para identificar URLs http/https
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const textoComLinks = escapado.replace(urlRegex, (url) => {
      const isMaps = url.includes('maps.google') || url.includes('goo.gl/maps') || url.includes('maps.app.goo.gl');
      const isInstagram = url.includes('instagram.com');
      const icone = isMaps ? '📍' : isInstagram ? '📸' : '🔗';

      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-emerald-700 hover:text-emerald-900 underline font-medium inline-flex items-center gap-1 break-all cursor-pointer transition-colors" title="Abrir link externo"><span>${icone}</span><span>${url}</span></a>`;
    });

    return this.sanitizer.bypassSecurityTrustHtml(textoComLinks);
  }
}

