import Blockly from 'blockly';

const INITIAL_XML = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';

const BLOCKS_DICTIONARY: {[key:string]: object} = {
    "cast": {
        type: "cast",
    },
    "fire":{
        type: "fire"
    },
    "water":{
        type: "water"
    },
    "earth":{
        type: "earth"
    },
    "ice":{
        type: "ice"
    },
    "growth":{
        type: "growth"
    },
    "enchant":{
        type: "enchant"
    },
    "speed":{
        type: "speed"
    },
    "while":{
        type:"while"
    },
    "playerHasMana":{
        type:"playerHasMana"
    },
    "orb": {
        type:"orb"
    },
    "chargeMana" :{
        type:"chargeMana"
    },
    "throwOrb": {
        type:"throwOrb"
    },
    "createOrb": {
        type:"createOrb"
    },
    "create": {
        type:"create"
    },
    "throw": {
        type:"throw"
    },
    "leftHand": {
        type:"leftHand"
    },
    "say":{
        type:"say"
    },
    "String": {
        "type": "String",
        "message0": "say %1 %2",
        "args0": [
            {
            "type": "input_dummy"
            },
            {
            "type": "field_input",
            "name": "message",
            "text": "anything"
            }
        ],
        "inputsInline": true,
        "previousStatement": "statement",
        "nextStatement": "statement",
        "colour": 45,
        "tooltip": "",
        "helpUrl": ""
    }

    // "controls_if": {
    //     type: 'controls_if'
    // },
    // "logic_compare": {
    //     type: 'logic_compare'
    // },
    // "math_number":{
    //     type: 'math_number'
    // },
    // "text":{
    //     type: "text"
    // }
};

(Blockly as any).Spel = new Blockly.Generator("Spel");
const bs = (Blockly as any).Spel;
//bs.Spel.init();
(Blockly as any).Spel.scrub_ = function(block:any, code:any, opt_thisOnly:any) {
    const nextBlock =
        block.nextConnection && block.nextConnection.targetBlock();
    const nextCode =
        opt_thisOnly ? '' : bs.blockToCode(nextBlock);
    return code +  nextCode;
};


bs.ORDER_ATOMIC = 0;
bs.ORDER_NONE = 99;

// Fire
Blockly.Blocks['fire'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("fire");
        $.setOutput(true, "element");
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['fire'] = function (block: any) {
    return ['fire', bs.ORDER_ATOMIC];
};

// Water
Blockly.Blocks['water'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("water");
        $.setOutput(true, "element");
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['water'] = function (block: any) {
    return ['water', bs.ORDER_ATOMIC];
};

// Earth
Blockly.Blocks['earth'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("earth");
        $.setOutput(true, "element");
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['earth'] = function (block: any) {
    return ['earth', bs.ORDER_ATOMIC];
};

// Ice
Blockly.Blocks['ice'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("ice");
        $.setOutput(true, "element");
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['ice'] = function (block: any) {
    return ['ice', bs.ORDER_ATOMIC];
};

// Cast
Blockly.Blocks['cast'] = {
    init: function () {
        const $ = (this as any);
        $.appendValueInput("element")
            .setCheck(['element'])
            .appendField("cast");
        $.setInputsInline(false);
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['cast'] = function (block: any) {
    var value_element = bs.valueToCode(block, 'element', bs.ORDER_ATOMIC) as string;
    var code = 'charge ' + value_element + ' mana.\n' +
                'release from hand.';
    return code;
};

// Growth
Blockly.Blocks['growth'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("growth");
        $.setOutput(true, "modifier");
        $.setColour(135);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['growth'] = function (block: any) {
    return ['growth', bs.ORDER_ATOMIC];
};

// Speed
Blockly.Blocks['speed'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("speed");
        $.setOutput(true, "modifier");
        $.setColour(135);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['speed'] = function (block: any) {
    return ['speed', bs.ORDER_ATOMIC];
};

// Enchant
Blockly.Blocks['enchant'] = {
    init: function() {
        const $ = (this as any);
        $.appendDummyInput()
            .appendField("enchant");
        $.appendValueInput("object")
            .setCheck("object");
        $.appendDummyInput()
            .appendField("with");
        $.appendValueInput("modifier")
            .setCheck(['element', 'modifier'])
            .setAlign(Blockly.ALIGN_RIGHT);
        $.setInputsInline(true);
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(75);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['enchant'] = function (block: any) {
    var object = bs.valueToCode(block, 'object', bs.ORDER_ATOMIC) as string;
    var modifier = bs.valueToCode(block, 'modifier', bs.ORDER_ATOMIC) as string;
    var code = 'enchant ' + object + ' with ' + modifier + '.';
    return code;
};

// playerHasMana
Blockly.Blocks['playerHasMana'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("player has Mana");
        $.setOutput(true, "Boolean");
        $.setColour(135);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['playerHasMana'] = function (block: any) {
    return ['playerHasMana', bs.ORDER_ATOMIC];
};

// While
Blockly.Blocks['while'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("as long as");
        $.appendValueInput("value")
            .setCheck("Boolean");
        $.appendDummyInput()
            .appendField(":");
        $.appendStatementInput("statements");
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['while'] = function (block: any) {
    var value = bs.valueToCode(block, 'value', bs.ORDER_ATOMIC);
    var stmts = bs.statementToCode(block, 'statements');
    if (stmts == undefined){
        return ['.', bs.ORDER_ATOMIC];
    }
    var code = 'as long as ' + (value as string) + ' : \n' + stmts + '\nterminus';
    return code;
};

// Charge
Blockly.Blocks['chargeMana'] = {
    init: function () {
        const $ = (this as any);
        $.appendDummyInput()
            .appendField("charge");
        $.appendValueInput("element")
            .setCheck(['element']);
        $.appendDummyInput()
            .appendField("mana");
        $.setInputsInline(true);
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['chargeMana'] = function (block: any) {
    var element = bs.valueToCode(block, 'element', bs.ORDER_ATOMIC) as string;
    var code = 'charge ' + element +' mana.';
    return code;
};

// Orb
Blockly.Blocks['orb'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("orb");
        $.setOutput(true, "object");
        $.setColour(135);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['orb'] = function (block: any) {
    return ['orb', bs.ORDER_ATOMIC];
};

// Throw Orb
Blockly.Blocks['throwOrb'] = {
    init: function () {
        const $ = (this as any);
        $.appendValueInput("element")
            .setCheck(['element'])
            .appendField("throw orb of");
        $.setInputsInline(false);
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['throwOrb'] = function (block: any) {
    var element = bs.valueToCode(block, 'element', bs.ORDER_ATOMIC) as string;
    var code = 'create orb in left hand.\n' +
                'enchant orb with ' + element + '.\n' +
                'throw orb.' ;
    return code;
};

// Create Orb
Blockly.Blocks['createOrb'] = {
    init: function () {
        const $ = (this as any);
        $.appendValueInput("element")
            .setCheck(['element'])
            .appendField("create orb with");
        $.setInputsInline(false);
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['createOrb'] = function (block: any) {
    var element = bs.valueToCode(block, 'element', bs.ORDER_ATOMIC) as string;
    var code = 'create orb in left hand.\n' +
                'enchant orb with ' + element + '.\n';
    return code;
};

// Create
Blockly.Blocks['create'] = {
    init: function () {
        const $ = (this as any);
        $.appendDummyInput()
            .appendField("create");
        $.appendValueInput("object")
            .setCheck(['object']);
        $.appendDummyInput()
            .appendField("in");
        $.appendValueInput("holder")
            .setCheck(['holder']);
        $.setInputsInline(true);
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['create'] = function (block: any) {
    var object = bs.valueToCode(block, 'object', bs.ORDER_ATOMIC) as string;
    var holder = bs.valueToCode(block, 'holder', bs.ORDER_ATOMIC) as string;
    var code = 'create ' + object + ' in ' + holder + '.\n';
    return code;
};

// Left Hand 
Blockly.Blocks['leftHand'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("left hand");
        $.setOutput(true, "holder");
        $.setColour(135);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['leftHand'] = function (block: any) {
    return ['left hand', bs.ORDER_ATOMIC];
};

// Throw
Blockly.Blocks['throw'] = {
    init: function () {
        const $ = (this as any);
        $.appendValueInput("object")
            .setCheck(['object'])
            .appendField("throw");
        $.setInputsInline(false);
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['throw'] = function (block: any) {
    var object = bs.valueToCode(block, 'object', bs.ORDER_ATOMIC) as string;
    var code = 'throw ' + object +'.';
    return code;
};

// Say
Blockly.Blocks['say'] = {
    init: function () {
        const $ = (this as any);
        $.appendValueInput("message")
            .setCheck(['String'])
            .appendField("say");
        $.setInputsInline(false);
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(45);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['say'] = function (block: any) {
    var value_element = bs.valueToCode(block, 'message', bs.ORDER_ATOMIC) as string;
    var code = 'say \'' + value_element + '\'';
    return code;
};

// String
Blockly.Blocks['String'] = {
    init: function () {
        const $ = (this as any);
        $.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("anything"), "message");
        // $.setInputsInline(true);
        $.setOutput(true, "String");
        $.setColour(210);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['String'] = function (block: any) {
    return [block.getFieldValue('message') as string, bs.ORDER_ATOMIC];
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