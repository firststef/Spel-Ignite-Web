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
    "playerMana":{
        type:"playerMana"
    },
    "orb": {
        type:"orb"
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
        $.setOutput(true, "skill");
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
        $.setOutput(true, "skill");
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
        $.setOutput(true, "skill");
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['earth'] = function (block: any) {
    return ['earth', bs.ORDER_ATOMIC];
};

// Cast
Blockly.Blocks['cast'] = {
    init: function () {
        const $ = (this as any);
        $.appendValueInput("skill")
            .setCheck(['skill'])
            .appendField("cast");
        $.setInputsInline(false);
        $.setPreviousStatement(true, "stmts");
        $.setNextStatement(true, "stmts");
        $.setPreviousStatement(true, "skill");
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['cast'] = function (block: any) {
    var value_skill = bs.valueToCode(block, 'skill', bs.ORDER_ATOMIC);
    var code = 'cast ' + (value_skill as string) + '.';
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

// Enchant speed
Blockly.Blocks['enchant'] = {
    init: function() {
        const $ = (this as any);
        $.appendDummyInput()
            .appendField("enchant");
        $.appendValueInput("skill")
            .setCheck("skill");
        $.appendDummyInput()
            .appendField("with");
        $.appendValueInput("modifier")
            .setCheck("modifier")
            .setAlign(Blockly.ALIGN_RIGHT);
        $.setInputsInline(true);
        $.setOutput(true, "skill");
        $.setColour(75);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['enchant'] = function (block: any) {
    var value_skill = bs.valueToCode(block, 'skill', bs.ORDER_ATOMIC);
    var value_modifier = bs.valueToCode(block, 'modifier', bs.ORDER_ATOMIC);
    var code = 'enchant ' + (value_skill as string) + ' with ' + value_modifier + '.';
    return [code, bs.ORDER_ATOMIC];
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

// PlayerMana
Blockly.Blocks['playerMana'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("playerMana");
        $.setOutput(true, "Boolean");
        $.setColour(135);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['playerMana'] = function (block: any) {
    return ['playerMana', bs.ORDER_ATOMIC];
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
        $.appendStatementInput("stmts");
        $.setOutput(true, null);
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['while'] = function (block: any) {
    var value = bs.valueToCode(block, 'value', bs.ORDER_ATOMIC);
    var stmts = bs.statementToCode(block, 'stmts');
    if (stmts == undefined){
        return ['.', bs.ORDER_ATOMIC];
    }
    var code = 'as long as ' + (value as string) + ' : \n' + stmts + '\nterminus';
    return [code, bs.ORDER_ATOMIC];
};

// Orb
Blockly.Blocks['orb'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("orb");
        $.setOutput(true, "modifier");
        $.setColour(135);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['orb'] = function (block: any) {
    return ['orb', bs.ORDER_ATOMIC];
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