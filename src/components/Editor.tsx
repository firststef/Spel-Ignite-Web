import React,  { CSSProperties, useState, useRef, useEffect, useMemo } from 'react';
import { Grid, Header, Segment, Tab} from 'semantic-ui-react';

import ReactBlockly from 'react-blockly';
import {BLOCKS_DICTIONARY, generateSpel, INITIAL_XML} from '../language/BlocklySpel';
import { INProps, ItemNode, ItemNodeType } from './ItemNode';

import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-plain_text";
import "ace-builds/src-noconflict/theme-github";

import {XML, XMLList} from 'sxml';

import {compile} from 'spells';
import { SpelError } from 'spells/out/spelVisitor';

type onCodeChangeCb = (code: string, e: Event|undefined)=> void;

function inventoryToBlocks(inv: Array<string>) : Array<object>{
    return inv.map((el:any) => BLOCKS_DICTIONARY[el]);
}

interface EditorProps {
    cb: onCodeChangeCb,
    inventory: Array<string>
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

    const prettyPrint = (errs: SpelError[]|undefined) => {
        if (!errs){
            return '<>';
        }
        let outStr = '';
        for (let err of errs){
            outStr += 'error at ' + err.range.start + ' : ' + err.message + '\r\n';
        }
        return outStr;
    }

    const compileCode = (code: string)=>{
        let compileResult = compile(code);
        let result = compileResult.result?.toString();
        console.log(result);
        if (compileResult.status == 'ok'){
            let sc = JSON.stringify(compileResult.result);
            setCompilerOut('spell is complete.');
            props.cb(sc, undefined);
        } else {
            setCompilerOut(prettyPrint(compileResult.errors));
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

    const recurseSearch = (xml: XML, already:string[]) =>{
        let blocks: XMLList = xml.get("block");
        for (let i=0;i<blocks.size();i++){
            let at = blocks.at(i);
            at.findProperty("type");
            already.push(at.getProperty("type")); 
            try{
                let values = at.get("value");
                for (let i=0;i<values.size();i++){
                    recurseSearch(values.at(i), already);
                }
            }
            catch(e){}

            try{
                let statement = at.get("statement");
                for (let i=0;i<statement.size();i++){
                    recurseSearch(statement.at(i), already);
                }
            }
            catch(e){}
        }
    };

    const dumpExistent = (inv: Map<string, number>) => {
        let ret:string[] = [];
        inv.forEach((v, f) => {
            if (v > 0){
                ret.push(f);
            }
        });
        return ret;
    }

    const filterAvailableInventory = () => {
        let countMap: Map<string, number> = new Map<string, number>();
        inventory.map(el => countMap.set(el, (countMap.get(el) != null? (countMap.get(el) as any) : 0) + 1));
        try{
            let xml: XML = new XML(xmlCode);
            let already: string[] = [];
            recurseSearch(xml, already);
            already.map(el => countMap.set(el, (countMap.get(el) as any) - 1));
        }
        catch(e){
        }
        return dumpExistent(countMap);
    };

    return (
        <>
        <Segment inverted style={{backgroundColor:"#036780"}}>
            <Grid stackable verticalAlign='middle'>
                <Grid.Row stretched>
                    {/* <Grid.Column width={3} floated='left' verticalAlign='top' style={{height:'100%', display:'flex',paddingRight:0}}>
                        <Header as="h3" style={{color:'white'}} textAlign="center">Inventory</Header>
                        <div style={{flexGrow:1,overflowX:'scroll',overflowY:'hidden'}}>
                            <ItemNode {...files}/>
                        </div>
                    </Grid.Column> */}
                    <Grid.Column /*width={13}*/ floated='right' verticalAlign='middle'>
                        <Tab panes={[
                            {
                                menuItem: 'tablets',
                                pane: activePane == 0 && (
                                <ReactBlockly
                                style={{overflow:'hidden'}}
                                toolboxBlocks={inventoryToBlocks(filterAvailableInventory())}
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
                                    style={{height:"67vh"}}
                                    mode="plain_text"
                                    theme="github"
                                    onChange={onCodeChange}
                                    name="editorSpel"
                                    editorProps={{ $blockScrolling: true }}
                                    width='auto'
                                    wrapEnabled
                                    key={1}
                                    placeholder={spelCode}
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
        <Segment inverted fluid="true" style={{height:"13vh"}}>
        Compiler out:<br/>
                {compilerOut}
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
