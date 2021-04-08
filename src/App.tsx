import React, { CSSProperties, useState, useRef, useEffect } from 'react';
import './App.css';

import { Container, Grid, Header, Segment, Sidebar } from 'semantic-ui-react';

import Unity, { UnityContext } from 'react-unity-webgl';
import { BLOCKS_DICTIONARY } from './language/BlocklySpel';
import { Editor } from './components/Editor';

const unityContext = new UnityContext({
    loaderUrl: "Build/html.loader.js",
    dataUrl: "Build/html.data",
    frameworkUrl: "Build/html.framework.js",
    codeUrl: "Build/html.wasm",
});

const App = () => {
    const defaultInventory = [
        'cast',
        'fire',
        'water',
        'earth',
        'growth',
        'enchant',
        'speed',
        'while',
    ];
    const [generatedInstructions, setGeneratedInstructions] = useState('');
    const [showEditor, setshowEditor] = useState(false);
    const [inventory, setInventory] = useState(defaultInventory);
    
    const onCodeChange = (code: string, e: Event|undefined) => {
        setGeneratedInstructions(code);
    }

    const action = async () => {
        console.log('send to unity ', generatedInstructions);
        unityContext.send("Player", "TriggerAction", generatedInstructions);
    }

    unityContext.on("RequestAction", ()=>{
        action();
    });
    unityContext.on("GamePaused", ()=>{
        setshowEditor(true);
    });
    unityContext.on("GameUnpaused", ()=>{
        setshowEditor(false);
    });
    unityContext.on("UpdateInventory", (str)=>{
        setInventory((JSON.parse(str) as any)['inventory']);
    });
    unityContext.on("canvas", (canvas) => {
        canvas.focus();
    });

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
                        visible={showEditor}
                        width={"very wide"}
                        style={{padding: '1em', width:"50%", height:"100%"}}
                    >
                        <Editor cb={onCodeChange} inventory={inventory}/>
                    </Sidebar>

                    <Sidebar.Pusher dimmed={showEditor} as="div">
                        <Unity unityContext={unityContext} tabIndex={1} style={{width:"100%", height:"95vh", background:"transparent"}} className={"game-canvas"}/>                            
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
            <Container>
                <Segment style={{ padding: '8em 0em' }} vertical>
                    <Grid container columns='equal' stackable verticalAlign='middle'>
                        <Grid.Row>
                            <Grid.Column>
                                {'This section will be dedicated to a written tutorial for the players'}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Container>
        </div>
    );
}

export default App;
