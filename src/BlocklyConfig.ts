import Blockly from 'blockly';
import BlocklyJavaScript from 'blockly/javascript';

const INITIAL_XML = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';

//Blockly.inject("1", {theme:{base:"deuteranopia"}})

// Blockly.Blocks['new_boundary_function'] = {
//     init: function () {
//         (this as any).appendDummyInput()
//             .appendField(new Blockly.FieldTextInput("Boundary Function Name"), "Name");
//         (this as any).appendStatementInput("Content")
//             .setCheck(null);
//         (this as any).setInputsInline(true);
//         (this as any).setColour(315);
//         (this as any).setTooltip("");
//         (this as any).setHelpUrl("");
//     }
// };

// (BlocklyPython as any)['new_boundary_function'] = function (block: any) {
//     var text_name = block.getFieldValue('Name');
//     var statements_content = (BlocklyPython as any).statementToCode(block, 'Content');
//     // TODO: Assemble Python into code variable.
//     var code = 'def ' + text_name + '(_object,**kwargs):\n' + statements_content + '\n';
//     return code;
// };

const BLOCKS_DICTIONARY: {[key:string]: object} = {
    "cast": {
        "type": "cast",
        "message0": "cast %1",
        "args0": [
          {
            "type": "input_value",
            "name": "skill",
            "check": "String"
          }
        ],
        "inputsInline": true,
        "colour": 230,
        "tooltip": "",
        "helpUrl": ""
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

const bjs = (BlocklyJavaScript as any);

Blockly.Blocks['cast'] = {
    init: function () {
        (this as any).appendValueInput("NAME")
            .setCheck(null)
            .appendField("cast");
        (this as any).setInputsInline(false);
        (this as any).setPreviousStatement(true, null);
        (this as any).setColour(330);
        (this as any).setTooltip("");
        (this as any).setHelpUrl("");
    }
};
bjs['cast'] = function (block: any) {
    var value_name = bjs.valueToCode(block, 'NAME', bjs.ORDER_ATOMIC);
    var code = 'cast ' + (value_name as string).replaceAll("'", "").replace("(", "").replace(")", "") + '.\n';
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
bjs['fire'] = function (block: any) {
    return ['fire', bjs.ORDER_NONE];
};

export {
    Blockly,
    BlocklyJavaScript,
    INITIAL_XML,
    BLOCKS_DICTIONARY
};