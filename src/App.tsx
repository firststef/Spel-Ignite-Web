import './fonts/joystix_monospace.ttf';
import './App.css';

import React, { CSSProperties, useState, useRef, useEffect } from 'react';

import { Container, Header, Segment, Sidebar, Tab, TabProps } from 'semantic-ui-react';

import Unity, { UnityContext } from 'react-unity-webgl';
import { Editor } from './components/Editor';
import { BLOCKS_DICTIONARY } from './language/BlocklySpel';

const unityContext = new UnityContext({
    loaderUrl: "Build/WebGL.loader.js",
    dataUrl: "Build/WebGL.data",
    frameworkUrl: "Build/WebGL.framework.js",
    codeUrl: "Build/WebGL.wasm",
});

const App = () => {
    useEffect(() => {    
        document.title = "Spel";
    });

    const defaultInventory = Object.keys(BLOCKS_DICTIONARY);
    const [generatedInstructions, setGeneratedInstructions] = useState('');
    const [showEditor, setshowEditor] = useState(false);
    const [inventory, setInventory] = useState(defaultInventory);
    const [activePane, setActivePane] = useState(0);

    const onCodeChange = (code: string, e: Event|undefined) => {
        setGeneratedInstructions(code);
    }

    const action = async () => {
        console.log('send to unity ', generatedInstructions);
        if (generatedInstructions != '' && generatedInstructions != null) {
            unityContext.send("Player", "TriggerAction", generatedInstructions);
        }
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
    unityContext.on("error", (message) => {
        alert('Oops, SPEL IGNITE threw an error. You can send the developer a message if you want, but keep in mind this is a development build. ' +
        'The error message was: '+ message);
    });

    const documentationPanes = [
        {
            menuItem: 'The story so far',
            pane: activePane == 0 && (
                <Segment key={0} style={{ padding: '2em 1em', color: '#800080', backgroundColor:'rgba(76, 175, 80, 0.8)', fontFamily:'JoystixMonospace', fontSize:'13px'}} vertical>
                    <p>
                        You find yourself on the road to the city of Gold, the Slando Capital. At least that is what it appears, 
                        because you in fact remember very little of who you are and what you were doing up to a little while ago.
                    </p> 
                    <p>
                        On the way you meet with... something not so friendly.
                    </p>
                </Segment>
            ),
        },
        {
            menuItem: 'Controls',
            pane: activePane == 1 && (
                <Segment key={1} style={{ padding: '2em 1em', color: '#800080', backgroundColor:'rgba(76, 175, 80, 0.8)', fontFamily:'JoystixMonospace', fontSize:'13px'}} vertical>
                <Header
                    content="How to play"
                    style={{ color: 'gold', fontFamily:'JoystixMonospace'}}
                />
                <p>
                    WASD = move character<br/>
                    Left Click = sword attack (it is rather useless, you're actually way better at magic)<br/>
                    Right Click = Trigger the current spell (or more precisely, the most recent correct spell)<br/>
                    Space = Open spell editor
                </p>
                </Segment>
            )
        },
        {
            menuItem: 'About the game',
            pane: activePane == 2 && (
            <Segment key={2} style={{ padding: '2em 1em', color: '#800080', backgroundColor:'rgba(76, 175, 80, 0.8)', fontFamily:'JoystixMonospace', fontSize:'13px'}} vertical>
                <div style={{ fontSize:'11px'}}>
                <Header
                    content="What is this game"
                    style={{ color: 'white', fontFamily:'JoystixMonospace'}}
                />
                <p>
                    Actually let's start with why 
                </p>
                <Header
                    content="Why is this game"
                    style={{ color: 'white', fontFamily:'JoystixMonospace'}}
                />
                <p>
                    As a coder you might have one day encountered a particular language feature that amazed you 
                    (for me, c++'s making recursive functions using variadic parameter packs was particularly addicting).
                    Discovering a language is really fun. Not to mention, sometimes it feels like 
                    <span style={{color:'blue'}}> magic</span>.
                </p>
                <p>
                    I particularly like weird languages. When i found <a href="https://esolangs.org/wiki/Main_Page">esolangs</a> I
                    was really inspired. I also made a weird looking language, <a href="https://github.com/firststef/SPEL">SPEL</a>,
                    in my 2nd year in college, on which i based this project.
                </p>
                <p>
                    I wanted to craft a coding experience that was immersive, and the best example of this was found in games.
                    I play a lot of games, but the games I love all have an interesting world, filled with mistery and beings that 
                    feel real. 
                    The game above is (just) the start of a project while pursuing this goal.
                </p>
                <Header
                    content="What is this game"
                    style={{ color: 'white', fontFamily:'JoystixMonospace'}}
                />
                <p>
                    When I started the design for this game I asked myself some questions. 
                    <li>"What is a programming language in a magical world?"</li>
                    <li>"What is a program in a magical world?"</li>
                    <li>"If programming is magic, what is executing a program in a magical world?"</li>
                </p>
                <p>
                    The answers I found, I tried implementing them in this game. Basically, in a fantasy world, 
                    a spell is a set of actions the wizard does in order to change something. Magic is what we 
                    call the execution of these instructions. About the nature of these actions: are they mana-oriented?
                </p>
                <p>
                    Mana, a source of energy found present in some creatures, is most of the times the generator for spells.
                    This energy kinda resembles a program flow, by expanding or burning it in different ways you can 
                    obtain different effects. I imagined mana system that is based on the different attributes of mana:
                </p>
                <Segment inverted>
                    <p>store x = obtain mana from body 80.</p>
                    <p>store x = transmute mana to fire mana.</p>
                    <p>create fire orb y from x.</p>
                    <p>apply mana reinforcement to y.</p>
                    <p>throw y as fireball.</p>
                </Segment>
                <p>
                    Even though it sounded cool, it felt very limiting, dwelling on the various aspects of mana. I wanted
                    to focus on gameplay too, and also there is more to magic then mana. The way you interact with the world, 
                    the environment are also very important. Also i didn't want to make a game that feels like making chemistry
                    with mana.
                </p>
                <p>
                    The technology used backdoors is really complex, which is why I had to limit my design time and come with
                    a valid solution quick, to allow time for development. The thing is, at the most basic level, magic is about 
                    making actions. And doing magic is like doing some actions in an ordered fashion, first I charge my mana, 
                    then I apply some modifiers, etc etc. So in the end, to answer some of my questions, magic is about
                    automatizing some basic instructions. Spells are a set of these instructions. 
                </p>
                <p>
                    The most basic instruction at the time was releasing fire from your hand (or wand). The next level for that 
                    would be to make that fire take some form and throw it as a fireball. And the next level would be to 
                    <span style={{color:'red'}}> BURST A HUGE KAMEHAMEHA WAVE AND DESTROY EVERYTHING </span> :))))))).
                </p>
                <p>
                    For the current prototype I tried implementing some of the main points of the game, such as writing spells,
                    casting, progressing by finding blocks (ah yes, btw at first it was just coding, but then some people said 
                    it was too hard and meh so I added some blocks, and it feels better now), a simple puzzle (because learning
                    and puzzles work great together).
                </p>
                <Header
                    content="How does it work"
                    style={{ color: 'white', fontFamily:'JoystixMonospace'}}
                />
                <p>
                    To explain brielfy, I set the Blockly system to generate SPEL code. This code is passed to a SPEL compiler, 
                    written in antlr, that gives me a simplified json that tells me what specific instructions are present,
                    in a convenient tree-structure. This is sent by the javascript in the page to the unity build, which passes
                    it to a SPEL interpreter written in C# and embedded in the game code.
                </p>
                </div>
                <Header
                    content="Help"
                    style={{ color: 'white', fontFamily:'JoystixMonospace'}}
                />
                <p>
                    Currently the game has implemented the following features:
                </p>
                <Segment inverted>
                    cast [fire|water|earth].
                </Segment>
                <p>
                    Modifying spell attributes:
                </p>
                <Segment inverted>
                    enchant [fire|water|earth|composed] with [growth|speed]. {'=>'} returns a modified spell
                </Segment>
                <p>
                    Changing the nature of spells:
                </p>
                <Segment inverted>
                    enchant [fire|water|earth|composed] with [orb]. {'=>'} returns an upgraded spell
                </Segment>
                <p>
                    Note that some combinations might have some issues, but I do plan on improving the entire system.
                </p>
                <Segment inverted>
                    <p>as long as [playerMana] {' => '} while player has mana, throw fireball </p>
                    <p>&emsp;[cast enchant fire with orb.|any]</p>
                    <p>terminus</p>
                </Segment>
                <p>
                    Note that some combinations might have some issues, but I do plan on improving the entire system.
                </p>
                <Header
                    content="Contributing"
                    style={{ color: 'white', fontFamily:'JoystixMonospace'}}
                />
                <p>
                    <span style={{color:'blue'}}> DESIGN</span>: As you can see I put some thought into the design of programming 
                    as a substitute for magic in a 
                    fantasy world, so you know I feel it is important. I could really use some more ideas to grow this concept, 
                    so if you want to work with me on this, feel free to message me.
                </p>
                <p>
                    <span style={{color:'blue'}}> CODING</span>: For any bugs you find, please open an issue on the 
                    github <a href="https://github.com/firststef/Spel-Ignite-Game">repository</a>.
                </p>
            </Segment>
            )
        },
        {
            menuItem: 'Cheats',
            pane: activePane == 3 && (
                <Segment key={3} style={{ padding: '2em 1em', color: '#800080', backgroundColor:'rgba(76, 175, 80, 0.8)', fontFamily:'JoystixMonospace', fontSize:'13px'}} vertical>
                    <p>
                        Come back to this section for unlocked stuff in the game.
                    </p>
                    <p>
                        Spel works with 3 types of values in its "code": items, magic items and elements. You can create elements and some magic
                        items but normal items have to be picked up from the world.
                        Magic items: orbs (they can be enchanted and create fireballs, etc), shield, etc.
                    </p> 
                    {inventory.includes('cast') && (
                        <p>
                            Congrats, you have unlocked a chant:"lord of daybreak, release thy flames". This removes mana cost for fire magic.
                        </p>
                    )}
                    <p>
                        The shop allows you to decompose spells into more low-level blocks that have more flexibility. Some shop deals include 
                        passive deals, like the SharpShooter bundle, which allows you to throw items with the already known, release block.
                    </p>
                    <p>
                        What are chants? In the old ages it was believed you couldn't actually cast spells without knowing its specific words.
                        That is of course not true, you can cast spells without chants, but chants help you to focus and some of the have really
                        powerfull effects, like mana regen and some type of immunity. What exactly are chants and why do they work? When humanity
                        was left behind by the gods thousands of years ago, the gods said they will return, either to rule again or destroy us, 
                        and their only presence in this world is through the blood of the mages, that can tap into their destructive powers by
                        citing some specific words. That's right, those are chants.
                    </p>
                </Segment>
            ),
        },
    ];

    const flipActive = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, data: TabProps) => {
        if (data.activeIndex != undefined){
            setActivePane(parseInt(data.activeIndex.toString()));
        }
    }

    return (
        <div className="App" style={{ 
            backgroundPosition: 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize:'cover',
            backgroundImage: `url("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/01073865290819.5d61d475f0072.jpg")`,
            }}>
            <Header 
                as='h1' 
                style={{ fontSize: '7em', color:'gold', fontFamily:'JoystixMonospace' }} 
                content="Spel Ignite" 
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
                <Tab 
                    menu={{
                    }}
                    
                    activeIndex={activePane}
                    renderActiveOnly={false}
                    onTabChange={flipActive}
                    panes={documentationPanes}
                />
            </Container>
            <Segment inverted textAlign="center" vertical style={{ margin: '5em 0em 0em', padding: '5em 0em' }}>
                Spel Ignite @ firststef 2021
            </Segment>
        </div>
    );
}

export default App;
