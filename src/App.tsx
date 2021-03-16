import React, { CSSProperties, useState } from 'react';
import './App.css';

import { Container, Grid, Header, Message, Segment, Image, Tab, Button, Icon, TextArea, Sidebar } from 'semantic-ui-react';

import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import Unity, { UnityContext } from 'react-unity-webgl';

import Blockly from 'blockly';
import ReactBlockly from 'react-blockly';

const INITIAL_XML = '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="70" y="30"><field name="TEXT"></field></block></xml>';

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

class INState{
    children?: Array<INState>
    label: string
    type: ItemNodeType
    depth: number
    collapsed:boolean
    icon: any
    constructor(label: string, type:ItemNodeType, icon:any, children?: Array<INState>, collapsed:boolean=false, depth: number=0){
        this.label = label;
        this.type = type;
        this.depth = depth;
        this.collapsed = collapsed;
        this.children = children;
        this.icon = icon;
    }
}

class ItemNode extends React.Component<INState, INState>{
    constructor(props: INState){
        super(props);
        this.state = props;
    }

    toggle(){
        let $ = this;
        if ($.state.type == ItemNodeType.Directory){
            this.setState((state)=>({
                ...state, 
                collapsed: !state.collapsed
            }));
        }
        else if ($.state.label == 'Modify'){

        }
    } 

    render(){
        let $ = this;
        return (
            <div>
                {$.state.label != 'root' ? $.renderSelf(): null}
                {$.state.collapsed? $.renderChildren():null}
            </div>
        );
    }

    renderSelf(){
        let $ = this;
        return (
            <div style={{padding:'4px', paddingLeft:(8*$.state.depth).toString()+'px'}} >
            <Button icon labelPosition='left' onClick={$.toggle.bind($)} color="green">
                <Icon name={$.state.collapsed? 'caret down' : ($.state.type == ItemNodeType.File ? $.state.icon : 'folder')}/>
                {$.state.label}
            </Button>
            </div>
        );
    }

    renderChildren(){
        let $ = this;
        return (
            $.state.children?.map(c => 
                <ItemNode {...c} depth={$.state.label != 'root' ? $.state.depth+1: 0}/>
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
    activePane: number
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
          type: 'math_round'
        },
        {
          type: 'math_number'
        }
      ]
    },
    {
      name: 'Custom',
      colour: '#5CA699',
      blocks: [
        {
          type: 'new_boundary_function'
        },
        {
          type: 'return'
        },
      ]
    }
  ]

class Editor extends React.Component<EditorProps, EditorState>{
    constructor(props: EditorProps){
        super(props);
        this.state = {
            ...props,
            activePane: 0
        };
    }

    workspaceDidChange (workspace: any) {
        // workspace.registerButtonCallback('myFirstButtonPressed', () => {
        //   alert('button is pressed');
        // });

        const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
        //document.getElementById('generated-xml').innerText = newXml;
        
        const g = new Blockly.Generator("java");
        //const code = g.workspaceToCode(workspace);
        //document.getElementById('code').value = code;
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
                                    initialXml={INITIAL_XML}
                                    wrapperDivClassName="fill-height"
                                    workspaceDidChange={$.workspaceDidChange}
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
        );
    }

    files(){
        return new INState('root', ItemNodeType.Directory,'',[
            new INState('Modify', ItemNodeType.File, 'sun'),
            new INState('Previous', ItemNodeType.File, 'file'),
            new INState('Items', ItemNodeType.Directory, '', [
                new INState('Potion', ItemNodeType.File, 'chess rock')
            ])
        ],true);
    }

    onCodeChange(code: string){
        this.state.cb(code, undefined);
    }
}

interface IProps {}

interface IState {
    compilerOut?: string;
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
            compilerOut: 'Type the code in the input area to compile it and CAST it.',
            lastCompiledCode: [],
            currentChapter: StoryChapters.Beginnings,
            showEditor: false
        }

        unityContext.on("RequestAction", ()=>{
            $.action();
        });
        unityContext.on("GamePaused", ()=>{
            if (!$.state.showEditor){
                $.setState({
                    ...$.state,
                    showEditor: true
                })
            }
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
                                //unityContext.send("GameManager", "TogglePaused");
                                $.setState({...$.state, showEditor: !$.state.showEditor});
                            }}
                            visible={$.state.showEditor}
                            width={"very wide"}
                            style={{padding: '1em', width:"50%", height:"100%"}}
                        >
                            <Editor cb={$.onCodeChange.bind($)}/>
                            <Segment inverted fluid>
                                <p>{$.state.compilerOut}</p>
                            </Segment>
                        </Sidebar>

                        <Sidebar.Pusher dimmed={$.state.showEditor}>
                            <Unity unityContext={unityContext} tabIndex={1} style={{width:"100%", height:"100%"}} className={"game-canvas"}/>                            
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
