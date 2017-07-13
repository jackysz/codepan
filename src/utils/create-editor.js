/* eslint-disable import/no-unassigned-import */
import CodeMirror from 'codemirror'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/jsx/jsx'
import 'codemirror/mode/css/css'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/edit/matchtags'
import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/comment/comment'

const isMac = CodeMirror.keyMap.default === CodeMirror.keyMap.macDefault

export default function (el, opts = {}) {
  const editor = CodeMirror.fromTextArea(el, {
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: true,
    matchTags: { bothTags: true },
    matchBrackets: true,
    ...opts
  })

  editor.setOption('extraKeys', {
    ...editor.getOption('extraKeys'),
    Tab(cm) {
      const spaces = Array(cm.getOption('indentUnit') + 1).join(' ')
      cm.replaceSelection(spaces)
    },
    [isMac ? 'Cmd-/' : 'Ctrl-/'](cm) {
      cm.toggleComment()
    }
  })

  if (opts.mode === 'htmlmixed') {
    import(/* webpackChunkName: "emmet-codemirror" */  '@emmetio/codemirror-plugin').then(emmet => {
      emmet.default(CodeMirror)
      editor.setOption('extraKeys', {
        ...editor.getOption('extraKeys'),
        'Tab': 'emmetExpandAbbreviation',
		    'Enter': 'emmetInsertLineBreak'
      })
      editor.setOption('emmet', {
        markupSnippets: {
          'script:unpkg': 'script[src="https://unpkg.com/"]',
          'script:jsd': 'script[src="https://cdn.jsdelivr.net/npm/"]',
        }
      })
    })
  }

  return editor
}
