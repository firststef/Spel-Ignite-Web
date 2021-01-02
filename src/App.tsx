import React, { CSSProperties, useState } from 'react';
import './App.css';

import { Button, Container, Divider, Grid, Header, List, Message, Segment } from 'semantic-ui-react';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import {get} from 'http';

enum StoryChapters {
    Beginnings,
    TheBattle
}

interface IProps {}

interface IState {
    compilerOut?: string;
    currentChapter: StoryChapters
}

//todo unde am ramas: add first challange

class App extends React.Component<IProps, IState> {
    //server_l = 'Spel-Ignite-Server.firststef.repl.co';
    server_l = 'localhost';

    constructor(props:any){
        super(props);
        this.state = {
            compilerOut: 'Type the code in the input area to compile it and CAST it.',
            currentChapter: StoryChapters.Beginnings
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

    render() {
        let $ = this;
        
        return (
            <div className="App">
                <Container>
                    <Segment style={{ padding: '8em 0em' }} vertical>
                        <Grid container stackable verticalAlign='middle'>
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <Header as='h3' style={{ fontSize: '2em' }}>
                                        Spel - a programming game with with a fantasy setting
                                </Header>
                                    <p style={{ fontSize: '1.33em' }}>
                                        todo description
                                </p>
                                    <AceEditor
                                        mode="java"
                                        theme="github"
                                        onChange={$.onCodeChange.bind($)}
                                        name="editorSpel"
                                        editorProps={{ $blockScrolling: true }}
                                    />
                                </Grid.Column>
                                <Grid.Column floated='right' width={6} verticalAlign='middle'>
                                    <Grid.Row>
                                        <Segment inverted fluid>
                                            <p>{$.state.compilerOut}</p>
                                        </Segment>
                                    </Grid.Row>
                                    <Grid.Row>
                                       
                                    </Grid.Row>
                                </Grid.Column>
                            </Grid.Row>
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
            port: 80,
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
