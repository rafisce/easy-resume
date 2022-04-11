import {
  convertToRaw,
  Editor,
  EditorState,
  getDefaultKeyBinding,
  RichUtils,
} from "draft-js";
import React from "react";
import "../rich-editor.css";
import "../../node_modules/draft-js/dist/Draft.css";
import {
  faListOl,
  faListUl,
  faAlignCenter,
  faAlignLeft,
  faAlignRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class RichEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: props.editorState
        ? props.editorState
        : EditorState.createEmpty(),
    };
    this.dir = "right";
    this.old =null;

    //this.focus = () => this.useR.editor.focus();
    this.onChange = (editorState) => {
      const old=editorState
      this.setState({ editorState });
     // this.props.updateParent(editorState)
    };
    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.mapKeyToEditorCommand = this._mapKeyToEditorCommand.bind(this);
    this.toggleBlockType = this._toggleBlockType.bind(this);
    this.toggleInlineStyle = this._toggleInlineStyle.bind(this);
  }

  _handleKeyCommand(command, editorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _mapKeyToEditorCommand(e) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(
        e,
        this.state.editorState,

        4 /* maxDepth */
      );
      if (newEditorState !== this.state.editorState) {
        this.onChange(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  _toggleBlockType(blockType) {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, blockType));
  }

  _toggleInlineStyle(inlineStyle) {
    const align = ["align-left", "align-center", "align-right"];

    if (String(inlineStyle).includes("align")) {
      align.forEach((alignment) => {
        if (alignment.includes(inlineStyle)) {
          this.dir = alignment.replace("align-", "");
        }
      });
    }
    this.onChange(
      RichUtils.toggleInlineStyle(this.state.editorState, inlineStyle)
    );
  }

  render() {
    const { editorState } = this.state;

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = "RichEditor-editor";
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== "unstyled") {
        className += " RichEditor-hidePlaceholder";
      }
    }

    return (
      <div className="RichEditor-root">
        {!this.props.plain ? (
          <BlockStyleControls
            editorState={editorState}
            onToggle={this.toggleBlockType}
          />
        ) : null}

        <InlineStyleControls
          dir={this.dir}
          editorState={editorState}
          onToggle={this.toggleInlineStyle}
        />
        <div className={className} onClick={this.focus}>
          <Editor
            blockStyleFn={getBlockStyle}
            customStyleMap={styleMap}
            editorState={editorState}
            handleKeyCommand={this.handleKeyCommand}
            keyBindingFn={this.mapKeyToEditorCommand}
            onChange={this.onChange}
            placeholder="תיאור..."
            textAlignment={this.dir}
            spellCheck={true}
            
              
            onBlur={(e) => {
              if(editorState.getCurrentContent().getPlainText()!==this.old){
                this.props.updateParent(editorState);
              }
           
            }}

            onFocus={(e)=>{
              this.old=editorState.getCurrentContent().getPlainText();
            }}

            
          />
        </div>
      </div>
    );
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

function getBlockStyle(block) {
  switch (block.getType()) {
    case "blockquote":
      return "RichEditor-blockquote";
    default:
      return null;
  }
}

class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  render() {
    let className = "RichEditor-styleButton";
    if (this.props.active) {
      className += " RichEditor-activeButton";
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.props.label}
      </span>
    );
  }
}

const BLOCK_TYPES = [
  {
    label: "UL",
    style: "unordered-list-item",
    icon: <FontAwesomeIcon icon={faListUl} />,
  },
  {
    label: "OL",
    style: "ordered-list-item",
    icon: <FontAwesomeIcon icon={faListOl} />,
  },
];

const BlockStyleControls = (props) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.icon ? type.icon : type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

var INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  {
    label: "AR",
    style: "align-right",
    icon: <FontAwesomeIcon icon={faAlignRight} />,
  },
  {
    label: "AC",
    style: "align-center",
    icon: <FontAwesomeIcon icon={faAlignCenter} />,
  },
  {
    label: "AL",
    style: "align-left",
    icon: <FontAwesomeIcon icon={faAlignLeft} />,
  },
];

const InlineStyleControls = (props) => {
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={
            type.style.includes("align")
              ? currentStyle.has(type.style) && type.style.includes(props.dir)
              : currentStyle.has(type.style)
          }
          label={type.icon ? type.icon : type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      ))}
    </div>
  );
};

export default RichEditor;
