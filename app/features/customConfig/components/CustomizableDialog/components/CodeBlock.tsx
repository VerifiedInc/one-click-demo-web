import { useEffect, useMemo, useRef } from 'react';
import { tags as t } from '@lezer/highlight';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { javascript } from '@codemirror/lang-javascript';
import { Stack, Typography, Box, IconButton } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

import { omitProperties } from '~/utils/object';
import { useCopyToClipboard } from '~/hooks/useCopyToClipboard';
import { useAppContext } from '~/context/AppContext';

const styles = [
  {
    tag: [
      t.keyword,
      t.operatorKeyword,
      t.modifier,
      t.color,
      t.constant(t.name),
      t.standard(t.name),
      t.standard(t.tagName),
      t.special(t.brace),
      t.atom,
      t.bool,
      t.special(t.variableName),
    ],
    color: '#569cd6',
  },
  {
    tag: [t.controlKeyword, t.moduleKeyword],
    color: '#c586c0',
  },
  {
    tag: [
      t.name,
      t.deleted,
      t.character,
      t.macroName,
      t.propertyName,
      t.variableName,
      t.labelName,
      t.definition(t.name),
    ],
    color: '#9cdcfe',
  },
  { tag: t.heading, fontWeight: 'bold', color: '#9cdcfe' },
  {
    tag: [
      t.typeName,
      t.className,
      t.tagName,
      t.number,
      t.changed,
      t.annotation,
      t.self,
      t.namespace,
    ],
    color: '#4ec9b0',
  },
  {
    tag: [t.function(t.variableName), t.function(t.propertyName)],
    color: '#dcdcaa',
  },
  { tag: [t.number], color: '#b5cea8' },
  {
    tag: [t.operator, t.punctuation, t.separator, t.url, t.escape, t.regexp],
    color: '#d4d4d4',
  },
  {
    tag: [t.regexp],
    color: '#d16969',
  },
  {
    tag: [t.special(t.string), t.processingInstruction, t.string, t.inserted],
    color: '#ce9178',
  },
  { tag: [t.angleBracket], color: '#808080' },
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: [t.meta, t.comment], color: '#6a9955' },
  { tag: t.link, color: '#6a9955', textDecoration: 'underline' },
  { tag: t.invalid, color: '#ff0000' },
];

const theme = EditorView.theme(
  {
    '&': {
      fontFamily:
        'Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono", "Courier New", monospace',
      backgroundColor: '#171717',
      color: '#9cdcfe',
    },
    '.cm-content': {
      caretColor: '#c6c6c6',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: '#c6c6c6',
    },
    '&.cm-focused .cm-selectionBackgroundm .cm-selectionBackground, .cm-content ::selection':
      {
        backgroundColor: '#6199ff2f',
      },
    '.cm-activeLine': {
      backgroundColor: '#ffffff0f',
    },
    '.cm-gutters': {
      backgroundColor: '#1e1e1e',
      color: '##838383',
    },
    '.cm-activeLineGutter': {
      backgroundColor: '#ffffff0f',
    },
  },
  {
    dark: true,
  }
);
const highlightStyle = HighlightStyle.define(styles);

export function CodeBlock() {
  const appContext = useAppContext();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const codeBlockRef = useRef<EditorView | null>(null);
  const formContext = useFormContext();
  const data = formContext.watch();
  const isDummy = data.environment === 'dummy';
  const values = useMemo(() => {
    return JSON.stringify(
      omitProperties(data, ['environment', 'isNew', 'id']),
      null,
      2
    );
  }, [data]);
  const copyToClipboard = useCopyToClipboard({ type: 'text/plain' });

  const renderDomain = () => {
    if (!data.environment) return null;

    let domain;
    if (isDummy) {
      domain = appContext.config.dummyEnvCoreServiceUrl;
    } else {
      domain = appContext.config.realEnvCoreServiceUrl;
    }

    return (
      <Typography
        className='special'
        sx={{
          px: 2,
          textAlign: 'left!important',
          fontSize: '11px',
          fontWeight: 'bold',
          color: 'rgba(255, 255, 255, 0.50)',
        }}
      >
        <Typography
          component='span'
          color='white'
          sx={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: 'rgba(255, 255, 255, 1)',
          }}
        >
          POST
        </Typography>{' '}
        {domain}
        <Typography
          component='span'
          sx={{
            fontSize: '11px',
            fontWeight: 'bold',
            color: 'rgba(255, 255, 255, 1)',
          }}
        >
          /1-click
        </Typography>
      </Typography>
    );
  };

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    codeBlockRef.current = new EditorView({
      doc: values,
      extensions: [
        theme,
        syntaxHighlighting(highlightStyle),
        basicSetup,
        javascript(),
        EditorView.lineWrapping,
        EditorState.readOnly.of(true),
      ],
      parent: container,
    });
    return () => codeBlockRef.current?.destroy();
  }, [values]);

  return (
    <Stack
      direction='column'
      sx={{
        pt: 4,
        pb: 2.5,
        flexShrink: 0,
        maxWidth: '391px',
        width: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.87)',
        alignSelf: 'stretch',
      }}
    >
      <Box sx={{ px: 2 }}>
        <Typography variant='h2' sx={{ color: 'white' }}>
          Live Code
        </Typography>
        <Typography
          sx={{ mt: 2, fontSize: '16px', color: 'rgba(255, 255, 255, 0.50)' }}
        >
          1-Click Signup takes just 1 API call.
          <br />
          See the Verified docs for details.
        </Typography>
      </Box>
      <Box
        sx={{
          mt: 4,
          '& p, & span': {
            fontFamily: 'Menlo',
          },
        }}
      >
        {renderDomain()}
        <Box
          sx={{
            position: 'relative',
            mt: 2,
          }}
        >
          <Box
            ref={containerRef}
            sx={{
              fontSize: '14px',
              '& .cm-editor': {
                height: 'auto!important',
              },
            }}
          />
          <IconButton
            onClick={() => copyToClipboard.copy(values)}
            sx={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: '43px',
              height: '43px',
              flexShrink: 0,
              aspectRatio: '1',
              color: 'white',
            }}
          >
            <ContentCopy fontSize='small' />
          </IconButton>
        </Box>
      </Box>
    </Stack>
  );
}
