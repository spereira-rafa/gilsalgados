# Gil Salgados

Site institucional estático em português, inspirado no modelo fornecido, com layout responsivo, filtros de cardápio e encomendas via WhatsApp. Sem dependências de produção ou etapa de build.

## Desenvolvimento

Requisito: Python 3. Execute no checkout existente:

```sh
cd /workspace/gilsalgados
python3 dev.py
```

O servidor usa a porta 3000 e serve o site no caminho `/gilsalgados/`. A raiz redireciona para esse caminho apenas no servidor local. Não crie um worktree: cada tarefa na nuvem já tem ambiente isolado.

## Orçamento para eventos

O botão de orçamento abre uma janela acessível com um formulário com nome, ocasião, quantidade de pessoas, data e preferências. Nome, ocasião e quantidade são obrigatórios. A data é opcional e não pode estar no passado, considerando o dia local do visitante. O formulário abre o WhatsApp com uma mensagem preenchida; o visitante revisa e envia. Não há armazenamento de dados no servidor, confirmação de reserva ou envio automático de mensagem.

## Fotografias originais

As oito fotos de produtos foram importadas da branch `spereira-rafa-patch-1`, commit `3fd8aed7ac7568ab818a311b571305b0a754b0d3`, sem modificar os arquivos originais. Estão em `site/assets/` com nomes descritivos, habilitadas em `availablePhotos` no `site/app.js`. A captura da interface do Codex foi excluída da importação ao site.

O cardápio usa as fotos reais. A capa continua como imagem ilustrativa gerada para o layout de referência.

## Vercel e preservação do ambiente existente

Nenhuma implantação foi feita. Não há credenciais Vercel neste projeto. Não altere projetos, domínios ou configurações existentes sem identificar o destino correto.

O arquivo `vercel.json` é destinado a um **novo projeto isolado**, com nome sugerido `gilsalgados`: preset Other, sem comando de build e Output Directory `site`. Ele disponibiliza a aplicação em `/gilsalgados` e `/gilsalgados/`, com assets sob o mesmo prefixo. Não sobreponha o `vercel.json` de um projeto existente com este arquivo.

Se `/gilsalgados` precisar estar no domínio de um projeto Vercel já existente, será necessário identificar esse projeto e integrar apenas as rotas desse prefixo à configuração atual. Isso é diferente de criar um projeto separado. Preserve todas as outras rotas e configurações. Não associe nem substitua domínios existentes automaticamente.

Contatos confirmados: WhatsApp +55 71 98528-1777; Instagram @salgadosda.gil. Valores e disponibilidade são tratados diretamente pelo WhatsApp; o site não inventa preços ou depoimentos.

## Layout de referência

A composição segue a referência visual fornecida: navegação compacta, marca completa na abertura, faixas de diferenciais e eventos, oito categorias do cardápio atual, seção sobre a marca e rodapé com ondas douradas. O orçamento abre em um diálogo, com fechamento por botão ou Escape e foco contido na janela.

A pessoa e os depoimentos do modelo foram confirmados como exemplos. A seção sobre usa o retrato fornecido posteriormente pela usuária em `site/assets/GIL.png`, com seu texto de apresentação. Os cartões apresentam diferenciais da marca em vez de avaliações de exemplo.

O retrato atualizado original está preservado em `site/assets/GIL.png`. A versão exibida em `gil-site.png` foi preparada a partir dele com remoção do fundo quadriculado, em PNG transparente. O enquadramento 3:4 mostra o chapéu até a região da barriga.

Retrato em uso: `gil02-site.png`, preparado com fundo transparente a partir de `GIL02.jpeg`. O arquivo original permanece preservado.
