import React, { CSSProperties, useState } from 'react';
import './App.css';

import { Container, Grid, Header, Message, Segment, Tab, Button, Icon, Sidebar } from 'semantic-ui-react';

// import AceEditor from 'react-ace';
// import "ace-builds/src-noconflict/mode-java";
// import "ace-builds/src-noconflict/theme-github";

import Unity, { UnityContext } from 'react-unity-webgl';
import { BLOCKS_DICTIONARY } from './language/BlocklySpel';
import { Editor } from './components/Editor';

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

function inventoryToBlocks(inv: Array<string>) : Array<object>{
    return inv.map(el => BLOCKS_DICTIONARY[el]);
}

interface IProps {}

interface IState {
    currentChapter: StoryChapters,
    lastCompiledCode: any,
    showEditor: boolean,
    inventory: Array<object>
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
            showEditor: false,
            inventory: inventoryToBlocks(['cast'])
        }

        unityContext.on("RequestAction", ()=>{
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
        unityContext.on("UpdateInventory", (str)=>{
            $.setState({
                ...$.state,
                inventory: inventoryToBlocks((JSON.parse(str) as any)['inventory'])
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
                            <Editor cb={$.onCodeChange.bind($)} inventory={$.state.inventory}/>
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
