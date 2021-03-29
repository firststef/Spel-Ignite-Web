import Blockly from 'blockly';

const INITIAL_XML = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';

const BLOCKS_DICTIONARY: {[key:string]: object} = {
    "cast": {
        "type": "cast",
    },
    "fire_spell":{
        type: "fire"
    },
    "controls_if": {
        type: 'controls_if'
    },
    "logic_compare": {
        type: 'logic_compare'
    },
    "math_number":{
        type: 'math_number'
    },
    "text":{
        type: "text"
    }
};

(Blockly as any).Spel = new Blockly.Generator("Spel");
const bs = (Blockly as any).Spel;

bs.ORDER_ATOMIC = 0;
bs.ORDER_NONE = 99;

Blockly.Blocks['cast'] = {
    init: function () {
        const $ = (this as any);
        $.appendValueInput("NAME")
            .setCheck(null)
            .appendField("cast");
        $.setInputsInline(false);
        $.setPreviousStatement(true, null);
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['cast'] = function (block: any) {
    var value_name = bs.valueToCode(block, 'NAME', bs.ORDER_ATOMIC);
    var code = 'cast ' + (value_name as string) + '.\n';
    return code;
};

Blockly.Blocks['fire'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("fire");
        $.setOutput(true, null);
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['fire'] = function (block: any) {
    return ['fire', bs.ORDER_ATOMIC];
};

const generateSpel = (workspace: Blockly.Workspace): [string, string] => {
    const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    const code = bs.workspaceToCode(workspace);
    return [code, newXml];
}

export {
    INITIAL_XML,
    BLOCKS_DICTIONARY,
    generateSpel
};