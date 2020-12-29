import React, { CSSProperties, useState } from 'react';
import './App.css';

import { Button, Container, Divider, Grid, Header, List, Segment } from 'semantic-ui-react';

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import {get} from 'http';
const server_l = 'spel-ignite-server.firststef.repl.co';

interface IProps {
}

interface IState {
    compilerOut?: string;
}

class App extends React.Component<IProps, IState> {
    constructor(props:any){
        super(props);
        this.state = {
            compilerOut: 'ssssssssssssssssssssssssssssssssssssssss'
        }
    }

    onCodeChange(value: string, e: Event){
        this.requestCodeCompile(value);
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
                        </Grid>
                    </Segment>
                </Container>
            </div>
        );
    }

    requestCodeCompile(code: string){
        let $ = this;
        get({
            hostname: server_l,
            path: '/api/compile?code=\"' + code + '\"',
            port: 80,
            method: 'GET',
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        }, (res)=>{
            var str = '';
            res.on('data', function (chunk) {
              str += chunk;
            });
            res.on('end', function () {
              $.setState({
                  compilerOut: str
              });
            });
        });
    }
}

export default App;
