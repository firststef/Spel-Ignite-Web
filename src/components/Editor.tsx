import React from 'react';
import { Grid, Header, Segment, Tab} from 'semantic-ui-react';

import ReactBlockly from 'react-blockly';
import {generateSpel, INITIAL_XML} from '../language/BlocklySpel';
import { INProps, ItemNode, ItemNodeType } from './ItemNode';

import {compile} from 'spells';

type onCodeChangeCb = (code: string, e: Event|undefined)=> void;

interface EditorProps{
    cb: onCodeChangeCb,
    inventory: Array<object>
}

interface EditorState extends EditorProps {
    activePane: number,
    compilerOut: string,
    xmlCode: string,
}

class Editor extends React.Component<EditorProps, EditorState>{
    constructor(props: EditorProps){
        super(props);
        this.state = {
            ...props,
            activePane: 0,
            compilerOut: 'Type the code in the input area to compile it and CAST it.',
            xmlCode: INITIAL_XML,
        };
    }

    componentWillReceiveProps(props: EditorProps){
        let $ = this;
        this.setState({...$.state, inventory: props.inventory});
    }

    workspaceDidChange (workspace: any) {
        const [code, newXml] = generateSpel(workspace);
        let compileResult = compile(code);
        console.log(compileResult);
        if (compileResult.status){
            this.setState({
                ...this.state,
                compilerOut: code,
                xmlCode: newXml
            });
        } else {
            this.setState({
                ...this.state,
                compilerOut: compileResult.result,
                xmlCode: newXml
            });
        }
        this.state.cb(code, undefined);
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
                                // {
                                //     menuItem: 'script',
                                //     pane: this.state.activePane == 0 && (
                                //     <AceEditor
                                //         mode="java"
                                //         theme="github"
                                //         onChange={$.onCodeChange.bind($)}
                                //         name="editorSpel"
                                //         editorProps={{ $blockScrolling: true }}
                                //         width='auto'
                                //         wrapEnabled
                                //         key={0}
                                //         placeholder='Write code for your spell here'
                                //     />
                                // )},
                                {
                                    menuItem: 'tablets',
                                    pane: (
                                    <ReactBlockly
                                    style={{overflow:'hidden'}}
                                    toolboxBlocks={$.state.inventory}
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

export {
    Editor
};
export type {
    EditorProps,
    EditorState
};
