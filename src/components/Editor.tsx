import React,  { CSSProperties, useState, useRef, useEffect, useMemo } from 'react';
import { Grid, Header, Segment, Tab} from 'semantic-ui-react';

import ReactBlockly from 'react-blockly';
import {generateSpel, INITIAL_XML} from '../language/BlocklySpel';
import { INProps, ItemNode, ItemNodeType } from './ItemNode';

import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/theme-monokai";

import {compile} from 'spells';

type onCodeChangeCb = (code: string, e: Event|undefined)=> void;

interface EditorProps {
    cb: onCodeChangeCb,
    inventory: Array<object>
}

function Editor (props: EditorProps) {
    const defaultFiles = () => {
        return new INProps('root', ItemNodeType.Directory,'',[
            new INProps('Modify', ItemNodeType.File, 'sun'),
            new INProps('Previous', ItemNodeType.File, 'file'),
            new INProps('Items', ItemNodeType.Directory, '', [
                new INProps('Potion', ItemNodeType.File, 'chess rock')
            ])
        ],true);
    }

    const [activePane, setActivePane] = useState(0);
    const [compilerOut, setCompilerOut] = useState('Type the code in the input area to compile it and CAST it.');
    const [spelCode, setSpelCode] = useState('');
    const [xmlCode, setXmlCode] = useState(INITIAL_XML);
    const [inventory, setInventory] = useState(props.inventory);
    const [files, setFiles] = useState(defaultFiles());

    useMemo(() => {
        setInventory(props.inventory);
    }, [props.inventory]);

    const compileCode = (code: string)=>{
        let compileResult = compile(code);
        let result = compileResult.result?.toString();
        console.log(result);
        if (compileResult.status == 'ok'){
            setCompilerOut('spell is complete.');
            let sc = JSON.stringify(compileResult.result);
            props.cb(sc, undefined);
        } else {
            setCompilerOut(JSON.stringify(compileResult.errors));
        }
    }

    const workspaceDidChange = (workspace: any) => {
        const [code, newXml] = generateSpel(workspace);
        compileCode(code);
        setSpelCode(code);
        setXmlCode(newXml);
    }

    const onCodeChange = (code: string) =>{
        compileCode(code);
        setSpelCode(code);
    }

    const flipActive = () => {
        setActivePane(activePane == 0 ? 1 : 0);
    }

    return (
        <>
        <Segment inverted style={{backgroundColor:"#036780"}}>
            <Grid stackable verticalAlign='middle'>
                <Grid.Row>
                    <Grid.Column width={3} floated='left' verticalAlign='top' style={{height:'100%', display:'flex',paddingRight:0}}>
                        <Header as="h3" style={{color:'white'}} textAlign="center">Inventory</Header>
                        <div style={{flexGrow:1,overflowX:'scroll',overflowY:'hidden'}}>
                            <ItemNode {...files}/>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={13} floated='right' verticalAlign='middle'>
                        <Tab panes={[
                            {
                                menuItem: 'tablets',
                                pane: activePane == 0 && (
                                <ReactBlockly
                                style={{overflow:'hidden'}}
                                toolboxBlocks={inventory}
                                workspaceConfiguration={{
                                    grid: {
                                    colour: '#ccc',
                                    },
                                }}
                                initialXml={xmlCode}
                                wrapperDivClassName="fill-height"
                                workspaceDidChange={workspaceDidChange}
                                key={0}
                                />
                            )},
                            {
                                menuItem: 'script',
                                pane: activePane == 1 && (
                                <AceEditor
                                    mode="plain_text"
                                    theme="github"
                                    onChange={onCodeChange}
                                    name="editorSpel"
                                    editorProps={{ $blockScrolling: true }}
                                    width='auto'
                                    wrapEnabled
                                    key={1}
                                    placeholder='Write code for your spell here'
                                    value={spelCode}
                                />
                            )},
                        ]} 
                        renderActiveOnly={false}
                        onTabChange={flipActive}
                        activeIndex={activePane}
                        />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Segment>
        <Segment inverted fluid="true">
            <p>{compilerOut}</p>
        </Segment>
        </>
    );
}

export {
    Editor
};
export type {
    EditorProps,
};
