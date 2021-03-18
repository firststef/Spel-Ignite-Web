import React, { CSSProperties, useState } from 'react';
import './App.css';

import { Container, Grid, Header, Message, Segment, Image, Tab, Button, Icon, TextArea, Sidebar } from 'semantic-ui-react';

import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import Unity, { UnityContext } from 'react-unity-webgl';

import Blockly from 'blockly';
import ReactBlockly from 'react-blockly';
import BlocklyJavaScript from 'blockly/javascript';

const INITIAL_XML = '<xml xmlns="http://www.w3.org/1999/xhtml"><block id="1" type="text" x="70" y="30"><field name="TEXT"></field></block></xml>';

const unityContext = new UnityContext({
    loaderUrl: "Build/html.loader.js",
    dataUrl: "Build/html.data",
    frameworkUrl: "Build/html.framework.js",
    codeUrl: "Build/html.wasm",
});

enum StoryChapters {
    Beginnings,
    TheBattle
}

//todo unde am ramas: add first challange

enum ItemNodeType{
    File,
    Directory
}

class INProps{
    children?: Array<INProps>
    label: string
    type: ItemNodeType
    depth: number
    collapsed:boolean
    icon: any
    constructor(label: string, type:ItemNodeType, icon:any, children?: Array<INProps>, collapsed:boolean=false, depth: number=0){
        this.label = label;
        this.type = type;
        this.depth = depth;
        this.collapsed = collapsed;
        this.children = children;
        this.icon = icon;
    }
}

interface INState{
    collapsed: boolean;
}

class ItemNode extends React.Component<INProps, INState>{
    constructor(props: INProps){
        super(props);
        this.state = {
            collapsed: props.collapsed
        };
    }

    toggle(){
        let $ = this;
        if ($.props.type == ItemNodeType.Directory){
            this.setState((state)=>({
                ...state, 
                collapsed: !state.collapsed
            }));
        }
        else if ($.props.label == 'Modify'){

        }
    } 

    render(){
        let $ = this;
        return (
            <div>
                {$.props.label != 'root' ? $.renderSelf(): null}
                {$.state.collapsed? $.renderChildren():null}
            </div>
        );
    }

    renderSelf(){
        let $ = this;
        return (
            <div style={{padding:'4px', paddingLeft:(8*$.props.depth).toString()+'px'}} >
            <Button icon labelPosition='left' onClick={$.toggle.bind($)} color="green">
                <Icon name={$.state.collapsed? 'caret down' : ($.props.type == ItemNodeType.File ? $.props.icon : 'folder')}/>
                {$.props.label}
            </Button>
            </div>
        );
    }

    renderChildren(){
        let $ = this;
        return (
            $.props.children?.map((c, i) => 
                <ItemNode {...c} depth={$.props.label != 'root' ? $.props.depth+1: 0} key={i}/>
            )
        );
    }
}

type onCodeChangeCb = (code: string, e: Event|undefined)=> void;

interface EditorProps{
    cb: onCodeChangeCb
}

interface EditorState{
    cb: onCodeChangeCb,
    activePane: number,
    compilerOut: string,
    xmlCode: string
}

const toolboxCategories = [
    {
      name: 'Logic',
      colour: '#5C81A6',
      blocks: [
        {
          type: 'controls_if'
        },
        {
          type: 'logic_compare'
        }
      ]
    },
    {
      name: 'Math',
      colour: '#5CA65C',
      blocks: [
        {
          type: 'math_number'
        }
      ]
    },
    {
      name: 'Magic',
      colour: '#5CA699',
      blocks: [
        {
            "type": "cast",
            "message0": "cast %1",
            "args0": [
              {
                "type": "input_value",
                "name": "skill",
                "check": "String"
              }
            ],
            "inputsInline": true,
            "colour": 230,
            "tooltip": "",
            "helpUrl": ""
        },
        {
            "type": "text"
        }
      ]
    }
  ]

class Editor extends React.Component<EditorProps, EditorState>{
    constructor(props: EditorProps){
        super(props);
        this.state = {
            ...props,
            activePane: 0,
            compilerOut: 'Type the code in the input area to compile it and CAST it.',
            xmlCode: INITIAL_XML
        };
    }

    workspaceDidChange (workspace: any) {
        const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
        //Blockly.inject("1", {theme:{base:"deuteranopia"}})
        
        // Blockly.Blocks['new_boundary_function'] = {
        //     init: function () {
        //         (this as any).appendDummyInput()
        //             .appendField(new Blockly.FieldTextInput("Boundary Function Name"), "Name");
        //         (this as any).appendStatementInput("Content")
        //             .setCheck(null);
        //         (this as any).setInputsInline(true);
        //         (this as any).setColour(315);
        //         (this as any).setTooltip("");
        //         (this as any).setHelpUrl("");
        //     }
        // };
        
        // (BlocklyPython as any)['new_boundary_function'] = function (block: any) {
        //     var text_name = block.getFieldValue('Name');
        //     var statements_content = (BlocklyPython as any).statementToCode(block, 'Content');
        //     // TODO: Assemble Python into code variable.
        //     var code = 'def ' + text_name + '(_object,**kwargs):\n' + statements_content + '\n';
        //     return code;
        // };
        
        Blockly.Blocks['cast'] = {
            init: function () {
                (this as any).appendValueInput("NAME")
                    .setCheck(null)
                    .appendField("cast");
                (this as any).setInputsInline(false);
                (this as any).setPreviousStatement(true, null);
                (this as any).setColour(330);
                (this as any).setTooltip("");
                (this as any).setHelpUrl("");
            }
        };
        
        (BlocklyJavaScript as any)['cast'] = function (block: any) {
            var value_name = (BlocklyJavaScript as any).valueToCode(block, 'NAME', (BlocklyJavaScript as any).ORDER_ATOMIC);
            var code = 'cast ' + (value_name as string).replaceAll("'", "") + '.\n';
            return code;
        };

        const code = (BlocklyJavaScript as any).workspaceToCode(workspace);
        this.state.cb(code, undefined);
        this.setState({
            ...this.state,
            compilerOut: code,
            xmlCode: newXml
        });
    }

    flipActive(){
        this.setState({
            ...this.state,
            activePane: this.state.activePane == 0 ? 1 : 0
        });
    }

    render(){
        let $ = this;
        return (
            <>
            <Segment inverted style={{backgroundColor:"#036780"}}>
                <Grid stackable verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column width={3} floated='left' verticalAlign='top' style={{height:'100%', display:'flex',paddingRight:0}}>
                            <Header as="h3" style={{color:'white'}} textAlign="center">Inventory</Header>
                            <div style={{flexGrow:1,overflowX:'scroll',overflowY:'hidden'}}>
                                <ItemNode {...$.files()}/>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={13} floated='right' verticalAlign='middle'>
                            <Tab panes={[
                                {
                                    menuItem: 'script',
                                    pane: this.state.activePane == 0 && (
                                    <AceEditor
                                        mode="java"
                                        theme="github"
                                        onChange={$.onCodeChange.bind($)}
                                        name="editorSpel"
                                        editorProps={{ $blockScrolling: true }}
                                        width='auto'
                                        wrapEnabled
                                        key={0}
                                        placeholder='Write code for your spell here'
                                    />
                                )},
                                {
                                    menuItem: 'tablets',
                                    pane: this.state.activePane == 1 && (
                                    <ReactBlockly
                                    style={{overflow:'hidden'}}
                                    toolboxCategories={toolboxCategories}
                                    workspaceConfiguration={{
                                        grid: {
                                        colour: '#ccc',
                                        },
                                    }}
                                    initialXml={$.state.xmlCode}
                                    wrapperDivClassName="fill-height"
                                    workspaceDidChange={$.workspaceDidChange.bind($)}
                                    key={1}
                                    />
                                )}
                            ]} 
                            renderActiveOnly={false}
                            onTabChange={$.flipActive.bind($)}
                            activeIndex={$.state.activePane}
                            />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
            <Segment inverted fluid="true">
                <pre>{$.state.compilerOut}</pre>
            </Segment>
            </>
        );
    }

    files(){
        return new INProps('root', ItemNodeType.Directory,'',[
            new INProps('Modify', ItemNodeType.File, 'sun'),
            new INProps('Previous', ItemNodeType.File, 'file'),
            new INProps('Items', ItemNodeType.Directory, '', [
                new INProps('Potion', ItemNodeType.File, 'chess rock')
            ])
        ],true);
    }

    onCodeChange(code: string){
        this.state.cb(code, undefined);
    }
}

interface IProps {}

interface IState {
    currentChapter: StoryChapters,
    lastCompiledCode: any,
    showEditor: boolean
}

class App extends React.Component<IProps, IState> {
    //server_l = ''; // on server
    server_l = 'localhost';

    constructor(props:any){
        super(props);
        let $ = this;
        this.state = {
            lastCompiledCode: [],
            currentChapter: StoryChapters.Beginnings,
            showEditor: false
        }

        unityContext.on("RequestAction", (str)=>{
            console.log(str);
            $.action();
        });
        unityContext.on("GamePaused", ()=>{
            $.setState({
                ...$.state,
                showEditor: true
            });
        });
        unityContext.on("GameUnpaused", ()=>{
            $.setState({
                ...$.state,
                showEditor: false
            });
        });
    }

    onCodeChange(value: string, e: Event|undefined){
        this.requestCodeCompile(value);
    }

    beginnings(){
        let $ = this;
        return (
            <div>
                <h2>Chapter One: Beginnings</h2>
                <Message info>
                    <p>Your journey with <b>Spel</b> begins! Read this tutorial below to learn how to play the game.</p>
                </Message>
                <p>The game you are playing right now is just like any other: you can charge and cast spells, attack monsters,
                advance in level, etc. But something is different: you do all that with writing code!</p>

                <p><b>Spel</b> has a different syntax than most programming languages tho - it's definetely not made to be easy for you
                to write in (like python :P), but to emphasize on the type of world you'll be playing in: an ancient world with
                misteries and hidden treasures.</p>

                <p>You will learn Spel as you advance <b>Story Chapters</b>, which have the purpose to teach you the basic stuff. You 
                will use a special book here in this game, you can find it in the <b>Documentation</b> tab. This documentation is 
                actually only partially complete: it shows you the knowledge matching your level. As you advance, you find out more
                about Spel and how you can (actually) use magic.</p>

                <p>Let's get right into it!</p>

                <p>Here is your first Spel code: </p>
                <Segment color='red'>
                <code>The tale begins.<br/>

                I summon thy name Player<br/>
                craft points mana bestow 1.<br/>
                and thy brethren.<br/>
                </code>
                </Segment>
            </div>
        );
    }

    async action(){
        let skippedFirst = false;
        for(let cmd of this.state.lastCompiledCode) {
            ["fire", "water", "earth"].forEach(el => {
                if (cmd.startsWith(el)){
                    unityContext.send("Player", "TriggerAction", el);
                }
            });
            if (!skippedFirst){
                skippedFirst = true;
            }
            else{
                await new Promise(a => setTimeout(a, 500));
            }
        }
    }

    componentDidMount(){
        (document.getElementsByClassName("game-canvas").item(0) as HTMLElement)?.focus();
    }

    render() {
        let $ = this;
        
        return (
            <div className="App" style={{ 
                backgroundImage: `url("https://external-preview.redd.it/a4VESb6Bk1hJBnH0riwFOgoKMlag6T9_QJCAJRtry4g.png?format=pjpg&auto=webp&s=08a89deb8ef4de3e65945e7d2ed6f760baabafb8")` 
              }}>
                <Header 
                    as='h1' 
                    style={{ fontSize: '10em' }} 
                    content="Spel" 
                    subheader="A fantasy coding experience"
                    textAlign="center"
                />
                <div style={{padding: '1em'}}>
                    <Sidebar.Pushable as={Segment} style={{overflow:"hidden"}}>
                        <Sidebar
                            animation='overlay'
                            icon='labeled'
                            onHide={() => { 
                                (document.getElementsByClassName("game-canvas").item(0) as HTMLElement)?.focus(); 
                                unityContext.send("GameManager", "PlayFromEditor");
                            }}
                            visible={$.state.showEditor}
                            width={"very wide"}
                            style={{padding: '1em', width:"50%", height:"100%"}}
                        >
                            <Editor cb={$.onCodeChange.bind($)}/>
                        </Sidebar>

                        <Sidebar.Pusher dimmed={$.state.showEditor} as="div">
                            <Unity unityContext={unityContext} tabIndex={1} style={{width:"100%", height:"95vh", background:"transparent"}} className={"game-canvas"}/>                            
                        </Sidebar.Pusher>
                    </Sidebar.Pushable>
                </div>
                <Container>
                    <Segment style={{ padding: '8em 0em' }} vertical>
                        <Grid container columns='equal' stackable verticalAlign='middle'>
                            <Grid.Row>
                                <Grid.Column>
                                    {$.beginnings()}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                </Container>
            </div>
        );
    }

    requestCodeCompile(code: string) {
        let $ = this;
        // get({
        //     hostname: $.server_l,
        //     path: '/api/compile?code=' + Buffer.from(code).toString('base64'),
        //     //port: 80,
        //     method: 'GET',
        //     headers: {

        //     }
        // }, (res)=>{
        //     var str = '';
        //     res.on('data', function (chunk) {
        //       str += chunk;
        //     });
        //     res.on('end', function () {
        //         str = str.replace('\n', '<br>');
        //       $.setState({
        //           ...$.state,
        //           compilerOut: str
        //       });
        //     });
        // });
        let parts = code.split('cast ');
        this.setState({
            ...$.state,
            lastCompiledCode: parts
        });
    }
}

export default App;
