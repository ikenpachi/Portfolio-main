# Corrosivo / Igor Ribeiro

Portfólio estático de Igor Ribeiro, com foco em Cybersecurity, Ethical Hacking, Offensive Security e Red Team.

## Executar

Não há framework, dependências de produção, instalação ou etapa de build. Sirva a pasta com um servidor HTTP, pois o JavaScript usa módulos ES. Por exemplo, com Node.js/npm disponíveis:

```sh
npx http-server . -p 8080
```

Abra `http://localhost:8080`. Também é possível usar o Live Server do VS Code ou `py -m http.server 8080` quando Python estiver instalado. Abrir o HTML diretamente via `file://` não executa os módulos corretamente.

## Estrutura preservada

- `index.html`: abertura em duas colunas, Sobre, Experiência com seis abas, Projetos em grade e rodapé/contato.
- `css/styles.css`: tokens, temas, componentes e breakpoints.
- `css/menu-mobile.css`: navegação mobile com melhoria progressiva.
- `js/theme.js`: inicialização síncrona do tema antes do CSS, preferência do sistema e persistência em `localStorage` (`corrosivo-theme`).
- `js/script.js` e `js/modules/`: navegação, abas, animações e menu.
- `assets/`: imagens e currículo originais. O PDF foi preservado sem alterações de conteúdo.

A referência consultada foi `references/reference1.png`. Os dois temas usam a paleta solicitada; o destaque laranja é decorativo. IBM Plex Mono e Inter são carregadas pelo Google Fonts, com alternativas locais quando indisponíveis. O painel técnico da abertura é desenhado em CSS, sem imagem ou biblioteca adicional.

Conteúdo e links continuam disponíveis sem JavaScript: menu visível, todas as experiências abertas e nome estático. Com JavaScript, as abas permitem setas, Home, End, Enter e Espaço; o menu fecha ao navegar, clicar fora ou pressionar Escape. Animações respeitam `prefers-reduced-motion`.

## Fontes e conteúdo

Consulta realizada em 21/10/2026, via páginas públicas e API do GitHub, sem token no frontend:

- [Perfil GitHub](https://github.com/ikenpachi) e [README do perfil](https://github.com/ikenpachi/iKenpachi): nome, Corrosivo, Minas Gerais, pós-graduação e foco em segurança. O README confirma os endereços de LinkedIn, e-mail e portfólio fornecidos pelo proprietário.
- [HarpiaC2 / Command-and-Control](https://github.com/ikenpachi/Command-and-Control): README descreve PoC educacional em Python, sockets, AES/Diffie-Hellman, `cryptography` e múltiplas conexões. Último push retornado pela API: 04/06/2025. Não foi executado nem auditado o código desse projeto.
- [Wireless-Attacks-Docs-Red-Team](https://github.com/ikenpachi/Wireless-Attacks-Docs-Red-Team): documentação de estudos de segurança wireless e ferramentas de pentest. Último push: 02/04/2025. Não se afirma que os desafios ou scripts anunciados no README estejam concluídos.
- [Portfolio-main](https://github.com/ikenpachi/Portfolio-main): HTML/CSS/JavaScript e homepage no GitHub Pages; último push consultado: 29/05/2025.
- Também foram encontrados Best-README (Python; push em 21/10/2026), iKenpachi (08/10/2026) e W.A.S.P. (25/08/2025). Os dois primeiros são projetos de apresentação do perfil; W.A.S.P. não disponibilizou README. Não foram criadas alegações adicionais sobre funcionalidades ou maturidade desses projetos.

Datas de push são metadados de atividade, não certificação de qualidade, manutenção ativa ou lançamento. Os cartões usam dados locais, sem chamadas à API em tempo de execução.

O LinkedIn não pôde ser lido publicamente nesta sessão. Experiências e datas profissionais, AutoBot, Ready To Play e Xadrez foram preservados a partir do portfólio original; não foram verificados independentemente. Seus links originais continuam disponíveis. Nenhuma experiência, certificação ou proficiência foi inventada. O contato antigo por telefone e a localização Brasil–Portugal foram substituídos pelas informações fornecidas no pedido. O botão Buy Me a Coffee foi retirado por não haver confirmação pública do endereço.

## Validação

Validação em Microsoft Edge headless, servindo o projeto também sob `/Portfolio-main/`:

- Temas claro e escuro nas larguras 320, 375, 390, 430, 768, 1024, 1440 e 1920 px: overflow horizontal e imagens locais.
- Alternância e persistência após recarregar; detecção do tema do sistema e acompanhamento de mudanças quando não há escolha manual.
- Menu mobile: abrir, Escape e fechamento após navegação; abas: seleção por teclado e painel correspondente.
- Movimento reduzido e funcionamento sem JavaScript, incluindo as seis experiências e navegação em 320 px.
- Exceções JavaScript, respostas HTTP locais, caminhos sob o subdiretório e `git diff --check`.
- Inspeção das capturas de desktop nos dois temas e da página mobile.

Não existe comando de build a executar. Links de terceiros não confirmados e leitura humana do currículo permanecem como revisão editorial do proprietário. A configuração privada de Settings → Pages não é acessível pelo clone local.

## Publicar no GitHub Pages

Revise as alterações, crie seu commit e envie-o manualmente para a branch usada atualmente pelo Pages. Nenhum push é automático. Preserve a fonte de publicação já configurada no GitHub; se for publicação por branch, mantenha o diretório que contém este `index.html` (a raiz deste projeto).

O site usa caminhos relativos `./assets`, `./css` e `./js`, compatíveis com `https://ikenpachi.github.io/Portfolio-main/`. Não há Vite, rotas de aplicação ou `base` a configurar. Canonical e Open Graph apontam para esse endereço. Depois do deploy, verifique navegação, currículo e temas no endereço público.
