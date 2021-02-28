import React, { CSSProperties, useState } from 'react';
import './App.css';

import { Container, Grid, Header, Message, Segment, Image, Tab, Button, Icon, TextArea } from 'semantic-ui-react';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import game from './assets/img/game.png';

import {get} from 'http';

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
    constructor(label: string, type:ItemNodeType, children?: Array<INState>, collapsed:boolean=false, depth: number=0){
        this.label = label;
        this.type = type;
        this.depth = depth;
        this.collapsed = collapsed;
        this.children = children;
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
            this.setState((state, props)=>({
                ...state, 
                collapsed: !state.collapsed
            }));
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
                <Icon name={
                    $.state.collapsed? 'caret down' : ($.state.type == ItemNodeType.File ? 'file': 'folder')} 
                />
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

interface IProps {}

interface IState {
    compilerOut?: string;
    currentChapter: StoryChapters,
    files: Array<INState>
}

class App extends React.Component<IProps, IState> {
    //server_l = ''; // on server
    server_l = 'localhost';

    constructor(props:any){
        super(props);
        this.state = {
            compilerOut: 'Type the code in the input area to compile it and CAST it.',
            currentChapter: StoryChapters.Beginnings,
            files:[
                new INState('test1', ItemNodeType.File),
                new INState('test2', ItemNodeType.File),
                new INState('test3', ItemNodeType.Directory,[
                    new INState('wow', ItemNodeType.Directory, [
                        new INState('test4', ItemNodeType.File),
                        new INState('test5', ItemNodeType.File),
                        new INState('test6', ItemNodeType.Directory,[
                            new INState('wow2', ItemNodeType.Directory,[
                                new INState('test7', ItemNodeType.File),
                                new INState('test8', ItemNodeType.File),
                                new INState('test9', ItemNodeType.Directory,[
                                    new INState('wow3', ItemNodeType.Directory)
                                ])
                            ])
                        ])
                    ])
                ])
            ]
        }
    }

    onCodeChange(value: string, e: Event){
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

    files(){
        return new INState('root', ItemNodeType.Directory,this.state.files,true)
    }

    editor(){
        let $ = this;
        return (
            <Segment inverted style={{backgroundColor:"#036780"}}>
                <Grid stackable verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column width={3} floated='left' verticalAlign='top' style={{height:'100%', display:'flex',paddingRight:0}}>
                            <Header as="h3" style={{color:'white'}} textAlign="center">Files</Header>
                            <div style={{flexGrow:1,overflowX:'scroll',overflowY:'hidden'}}>
                                <ItemNode {...$.files()}/>
                            </div>
                        </Grid.Column>
                        <Grid.Column width={13} floated='right' verticalAlign='middle'>
                            <Tab panes={[{
                                menuItem: 'file',
                                pane: (
                                    <AceEditor
                                        mode="java"
                                        theme="github"
                                        onChange={$.onCodeChange.bind($)}
                                        name="editorSpel"
                                        editorProps={{ $blockScrolling: true }}
                                        width='auto'
                                        wrapEnabled
                                    />
                                )
                            }]} renderActiveOnly={false} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Segment>
        );
    }

    render() {
        let $ = this;
        
        return (
            <div className="App">
                <Header 
                    as='h1' 
                    style={{ fontSize: '10em' }} 
                    content="Spel" 
                    subheader="A fantasy coding experience"
                    textAlign="center"
                />
                <div style={{padding: '1em'}}>
                    <Grid columns='equal' stackable verticalAlign='middle'>
                        <Grid.Row>
                                <Grid.Column verticalAlign='middle'>
                                    {$.editor()}
                                    <Segment inverted fluid>
                                        <p>{$.state.compilerOut}</p>
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column floated='right' verticalAlign='middle'>
                                    <Image src={game} fluid centered/>                                       
                                </Grid.Column>
                            </Grid.Row>
                    </Grid>
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

    requestCodeCompile(code: string){
        let $ = this;
        get({
            hostname: $.server_l,
            path: '/api/compile?code=' + Buffer.from(code).toString('base64'),
            //port: 80,
            method: 'GET',
            headers: {

            }
        }, (res)=>{
            var str = '';
            res.on('data', function (chunk) {
              str += chunk;
            });
            res.on('end', function () {
                str = str.replace('\n', '<br>');
              $.setState({
                  ...$.state,
                  compilerOut: str
              });
            });
        });
    }
}

export default App;
