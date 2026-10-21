# Corrosivo / Igor Ribeiro

Portfólio estático de Igor Ribeiro, com foco em Cybersecurity, Ethical Hacking, Offensive Security e Red Team.

## Executar

Não há framework nem dependências de produção. O `js/script.js` já vem gerado e funciona tanto abrindo `index.html` diretamente (inclusive pelo launch do VS Code) quanto em um servidor HTTP. Para prévia por HTTP, com Node.js/npm disponíveis:

```sh
npx http-server . -a 127.0.0.1 -p 8080
```

Abra `http://localhost:8080`. Também é possível usar o Live Server do VS Code ou `py -m http.server 8080` quando Python estiver instalado.

Após editar `js/main.js` ou `js/modules/*.js`, gere novamente o arquivo de entrada usando Node.js 18 ou mais recente:

```sh
node scripts/build.mjs
```

O build usa apenas recursos nativos do Node, sem instalação de pacotes. Ele reúne os módulos em `js/script.js`, carregado como script clássico com `defer`, e atualiza as revisões dos URLs de CSS/JS para invalidar caches antigos. Não edite o arquivo gerado diretamente. O build não é necessário para abrir a versão já gerada; alterações de CSS/HTML também devem ser seguidas pelo comando antes de publicar, para atualizar as revisões.

## Estrutura preservada

- `index.html`: abertura em duas colunas, Sobre, Experiência em timeline (sete cargos em seis empresas), Projetos em grade e rodapé/contato. O HTML da timeline é a única fonte de dados das experiências.
- `css/experience.css`: timeline integrada aos tokens globais ciano/verde da V4.
- `css/styles.css`: tokens, temas, componentes e breakpoints.
- `css/menu-mobile.css`: navegação mobile com melhoria progressiva.
- `js/theme.js`: inicialização síncrona do tema antes do CSS, preferência do sistema e persistência em `localStorage` (`corrosivo-theme`).
- `js/main.js` e `js/modules/`: fontes da navegação, globo, animações e menu.
- `js/script.js`: entrada gerada, sem imports em tempo de execução; compatível com `file://` e GitHub Pages.
- `scripts/build.mjs`: build local sem dependências e com revisão dos arquivos de entrada.
- `assets/`: imagens e currículo originais. O PDF foi preservado sem alterações de conteúdo.

A V4 aplica a paleta ciano/verde globalmente, com fundos azulados, superfícies distintas para os temas, títulos e texto em Space Grotesk e detalhes em IBM Plex Mono. As fontes vêm do Google Fonts, com alternativas locais quando indisponíveis. As referências foram [QuimeraX](https://quimerax.com/) (composição e experiência interativa, sem cópia de código ou arte) e `references/reference1.png` (Nothing OS, grades e indicadores).

## Globo interativo

`js/modules/interactive-cyber-canvas.js` implementa um globo pontilhado em Canvas 2D, com continentes geográficos, rotação suave e uma lua menor. O cursor altera suavemente a orientação do globo; ao sair, a orientação adicional retorna gradualmente ao movimento ambiental. A malha anterior foi substituída.

- `requestAnimationFrame` e projeção esférica de pontos, sem cálculos de conexões entre pares.
- 1.764 pontos de continentes em telas amplas e 882 quando o estágio tem menos de 440 px; `devicePixelRatio` limitado a 1,75.
- `js/modules/world-land.js`: pontos pré-processados localmente a partir dos contornos Natural Earth 1:110m, de [domínio público](https://www.naturalearthdata.com/about/terms-of-use/). Nenhuma chamada de rede é necessária para os mapas durante o uso do site.
- `ResizeObserver` ajusta resolução e densidade ao tamanho real do estágio.
- `IntersectionObserver` e `visibilitychange` interrompem o loop fora da viewport ou em página oculta.
- Botão de pausa; `prefers-reduced-motion` mantém uma composição estática por padrão. O botão “Animar” permite iniciar a rotação por escolha explícita, inclusive quando essa preferência está ativa.
- Listeners, observers e quadros pendentes são removidos em `destroy()`, chamado no `pagehide`. Retorno por BFCache recria o controlador e preserva o estado de pausa.
- Canvas decorativo, sem bloquear cliques; uma imagem SVG real mantém o globo e a lua visíveis sem JavaScript ou Canvas 2D. O fallback só é ocultado após desenhar os dois corpos com sucesso, e reaparece em caso de perda de contexto ou erro de renderização. Não depende de máscara CSS, bloqueada pelo navegador na abertura direta de arquivos.
- Cores lidas dos tokens e atualizadas ao trocar o tema, inclusive com animação pausada.
- Cores RGB e tokens ausentes tratados sem concatenar sufixos hexadecimais inválidos. Ausência de ResizeObserver/IntersectionObserver tem alternativa por eventos de janela, mantendo o globo funcional.

O header tem transparência e estado de seção ativa. Hero, About, toolkit, Formação, timeline, projetos e contato receberam novos componentes e microinterações. As duas formações são transcritas do PDF local: FIAP (fev. 2024–fev. 2025) e Facthus (2020–2023), dentro de About, sem criar seções redundantes. Os sete cargos permanecem presentes; observações sobre fontes e divergências ficam somente no relatório de auditoria, fora da página. A Experience usa uma composição compacta em duas colunas no desktop e descrições recolhidas por padrão. Nome em uma linha e e-mail reduzido no rodapé. O script antigo de tilt deixou de ser carregado.

Conteúdo e links continuam disponíveis sem JavaScript: menu visível e nome estático. Todos os cargos aparecem na timeline; as atividades usam `details`/`summary` nativos, acessíveis por teclado e sem dependência de JavaScript. O menu fecha ao navegar, clicar fora ou pressionar Escape. Animações respeitam `prefers-reduced-motion`.

## Fontes e conteúdo

Consulta realizada em 21/10/2026, via páginas públicas e API do GitHub, sem token no frontend:

- [Perfil GitHub](https://github.com/ikenpachi) e [README do perfil](https://github.com/ikenpachi/iKenpachi): nome, Corrosivo, Minas Gerais, pós-graduação e foco em segurança. O README confirma os endereços de LinkedIn, e-mail e portfólio fornecidos pelo proprietário.
- [HarpiaC2 / Command-and-Control](https://github.com/ikenpachi/Command-and-Control): README descreve PoC educacional em Python, sockets, AES/Diffie-Hellman, `cryptography` e múltiplas conexões. Último push retornado pela API: 04/06/2025. Não foi executado nem auditado o código desse projeto.
- [Wireless-Attacks-Docs-Red-Team](https://github.com/ikenpachi/Wireless-Attacks-Docs-Red-Team): documentação de estudos de segurança wireless e ferramentas de pentest. Último push: 02/04/2025. Não se afirma que os desafios ou scripts anunciados no README estejam concluídos.
- [Portfolio-main](https://github.com/ikenpachi/Portfolio-main): HTML/CSS/JavaScript e homepage no GitHub Pages; último push consultado: 29/05/2025.
- Também foram encontrados Best-README (Python; push em 21/10/2026), iKenpachi (08/10/2026) e W.A.S.P. (25/08/2025). Os dois primeiros são projetos de apresentação do perfil; W.A.S.P. não disponibilizou README. Não foram criadas alegações adicionais sobre funcionalidades ou maturidade desses projetos.

Datas de push são metadados de atividade, não certificação de qualidade, manutenção ativa ou lançamento. Os cartões usam dados locais, sem chamadas à API em tempo de execução.

O LinkedIn não pôde ser lido publicamente. A atualização V3 usa as três páginas do PDF de LinkedIn fornecido localmente como fonte principal das experiências, complementadas pelos registros anteriores. Conflitos de cargos e períodos foram preservados no relatório de auditoria, sem criar empregos duplicados e sem observações editoriais na página. AutoBot, Ready To Play e Xadrez continuam provenientes do portfólio original, sem verificação independente. Nenhuma experiência, certificação ou proficiência foi inventada. O contato antigo por telefone e a localização Brasil–Portugal foram substituídos pelas informações fornecidas no pedido. O botão Buy Me a Coffee foi retirado por não haver confirmação pública do endereço.

O [relatório da atualização de experiências](EXPERIENCE-AUDIT.md) detalha fontes, divergências e testes. PDFs em `references` e arquivos em `tmp` são ignorados pelo Git e excluídos do processamento do GitHub Pages/Jekyll por `_config.yml`. O PDF permanece local, sem link ou cópia incorporada ao site. Em um deploy personalizado que envie arquivos brutos, mantenha essas exclusões explicitamente.

## Validação

Validação em Microsoft Edge headless, servindo o projeto também sob `/Portfolio-main/`:

- Temas claro e escuro nas larguras 320, 375, 390, 430, 768, 1024, 1440 e 1920 px: overflow horizontal e imagens locais.
- Alternância e persistência após recarregar; detecção do tema do sistema e acompanhamento de mudanças quando não há escolha manual.
- Menu mobile: abrir, Escape e fechamento após navegação. Na V3, a timeline substitui as antigas abas; expansão e recolhimento nativos funcionam por teclado.
- Movimento reduzido e funcionamento sem JavaScript, incluindo os sete cargos e navegação em 320 px.
- Exceções JavaScript, respostas HTTP locais, caminhos sob o subdiretório e `git diff --check`.
- Inspeção das capturas de desktop nos dois temas e da página mobile.
- Globo: coordenadas esféricas normalizadas, renderizações em movimento, reação ao cursor, pausa/retomada, cores após troca de tema, suspensão fora da viewport e movimento reduzido verificados. Nome em uma linha e ausência de overflow conferidos nas oito larguras e nos dois temas; sete cargos preservados, sem observações de PDF na página; expansão por teclado e fallback sem JavaScript testados.
- V4: cores de texto, textos secundários, labels, botão principal e texto verde com contraste calculado acima de 4,5:1 nas superfícies verificadas. Isso não representa uma auditoria completa de acessibilidade.
- V4: comparação automática com a versão anterior confirmou o conteúdo integral dos sete cargos; seis projetos preservados, duas formações documentadas, IDs únicos e links locais válidos. Nenhuma biblioteca nova ou migração de framework.
- V4: ausência dos antigos tokens laranja/creme/ciano neon nos estilos ativos; temas do canvas derivados dos mesmos tokens globais.

O build atual é `node scripts/build.mjs`. A ausência de build mencionada no relatório V3 descreve a versão anterior. Links de terceiros não confirmados e divergências históricas apontadas no relatório permanecem como revisão editorial do proprietário. A configuração privada de Settings → Pages não é acessível pelo clone local.

A regressão do globo foi reproduzida usando exatamente o modo `file://` de `.vscode/launch.json`: módulos ES e a máscara SVG eram bloqueados por CORS. Após a correção, foram testados `file://` e `/Portfolio-main/` por HTTP, ambos os temas e oito larguras. Os testes verificaram pixels desenhados, quadros sucessivos com coordenadas diferentes (rotação), pausa/retomada, movimento reduzido com ativação manual, fallback com Canvas/JavaScript desativados, cores RGB/ausentes, ausência de observers, recuperação de contexto, ciclo pagehide/pageshow, menu e teclado. Build reproduzível e validação de sintaxe também passaram.

Os testes de layout e interação foram executados em Edge headless; não equivalem a testes em aparelhos físicos ou a um benchmark de FPS em diferentes GPUs. A publicação não foi executada. `main`, `backup-redesign-v2`, currículo e referências locais foram preservados.

## Publicar no GitHub Pages

Execute o build, revise as alterações, crie seu commit e envie-o manualmente para a branch usada atualmente pelo Pages. Inclua `js/script.js` gerado e `index.html` com suas revisões atualizadas. Nenhum push é automático. Preserve a fonte de publicação já configurada no GitHub; se for publicação por branch, mantenha o diretório que contém este `index.html` (a raiz deste projeto).

O site usa caminhos relativos `./assets`, `./css` e `./js`, compatíveis com `https://ikenpachi.github.io/Portfolio-main/`. Não há Vite, rotas de aplicação ou `base` a configurar. Canonical e Open Graph apontam para esse endereço. Depois do deploy, verifique navegação, currículo e temas no endereço público.
