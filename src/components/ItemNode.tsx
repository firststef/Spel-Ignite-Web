import React from 'react';
import { Button, Icon } from 'semantic-ui-react';

enum ItemNodeType{
    File,
    Directory
}

class INProps{
    children?: Array<INProps>
    label: string
    type: ItemNodeType
    depth: number
    collapsed:boolean
    icon: any
    constructor(label: string, type:ItemNodeType, icon:any, children?: Array<INProps>, collapsed:boolean=false, depth: number=0){
        this.label = label;
        this.type = type;
        this.depth = depth;
        this.collapsed = collapsed;
        this.children = children;
        this.icon = icon;
    }
}

interface INState{
    collapsed: boolean;
}

class ItemNode extends React.Component<INProps, INState>{
    constructor(props: INProps){
        super(props);
        this.state = {
            collapsed: props.collapsed
        };
    }

    toggle(){
        let $ = this;
        if ($.props.type == ItemNodeType.Directory){
            this.setState((state)=>({
                ...state, 
                collapsed: !state.collapsed
            }));
        }
        else if ($.props.label == 'Modify'){

        }
    } 

    render(){
        let $ = this;
        return (
            <div>
                {$.props.label != 'root' ? $.renderSelf(): null}
                {$.state.collapsed? $.renderChildren():null}
            </div>
        );
    }

    renderSelf(){
        let $ = this;
        return (
            <div style={{padding:'4px', paddingLeft:(8*$.props.depth).toString()+'px'}} >
            <Button icon labelPosition='left' onClick={$.toggle.bind($)} color="green">
                <Icon name={$.state.collapsed? 'caret down' : ($.props.type == ItemNodeType.File ? $.props.icon : 'folder')}/>
                {$.props.label}
            </Button>
            </div>
        );
    }

    renderChildren(){
        let $ = this;
        return (
            $.props.children?.map((c, i) => 
                <ItemNode {...c} depth={$.props.label != 'root' ? $.props.depth+1: 0} key={i}/>
            )
        );
    }
}

export {
    INProps,
    ItemNodeType,
    ItemNode
};
export type { 
    INState
};
