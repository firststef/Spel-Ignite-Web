import Blockly from 'blockly';

const INITIAL_XML = '<xml xmlns="http://www.w3.org/1999/xhtml"></xml>';

const BLOCKS_DICTIONARY: {[key:string]: object} = {};
[
    "castFire",
    "cast",
    "fire",
    "water",
    "earth",
    "ice",
    "createElement",
    "create",
    "release",
    "leftHand",
    "soul",
    "orb",
    "enchantOrb",
    "enchant",
    "playerHasMana",
    "while",
    "throwOrb",
    "createOrb",
    "throw",
    "say",
    "String",
    "move",
    "rock",
    "arrow",
].forEach(el => {
    BLOCKS_DICTIONARY[el] = {
        type: el
    };
});

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

// Cast fire
Blockly.Blocks['castFire'] = {
    init: function () {
        const $ = (this as any);
        $.appendDummyInput("")
            .appendField("cast fire");
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['castFire'] = function (block: any) {
    var code = 
    'create fire in soul.\n' + 
    'move fire to left hand.\n' +           
    'release from left hand.';
    return code;
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
    var code = 
    'create ' + value_element + ' in soul.\n' +
    'move fire to left hand.\n' +
    'release from left hand.';
    return code;
};

// CreateElement
Blockly.Blocks['createElement'] = {
    init: function () {
        const $ = (this as any);
        $.appendDummyInput()
            .appendField("create");
        $.appendValueInput("element")
            .setCheck([ 'element']);
        $.setInputsInline(true);
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['createElement'] = function (block: any) {
    var element = bs.valueToCode(block, 'element', bs.ORDER_ATOMIC) as string;
    var code = 
    'create ' + element + ' in soul.\n' +
    'move ' + element + ' to left hand.\n';
    return code;
};

// Create
Blockly.Blocks['create'] = {
    init: function () {
        const $ = (this as any);
        $.appendDummyInput()
            .appendField("create");
        $.appendValueInput("object")
            .setCheck(['object', 'element']);
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

// Release
Blockly.Blocks['release'] = {
    init: function () {
        const $ = (this as any);
        $.appendValueInput("holder")
            .setCheck(['holder'])
            .appendField("release from");
        $.setInputsInline(false);
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['release'] = function (block: any) {
    var holder = bs.valueToCode(block, 'holder', bs.ORDER_ATOMIC) as string;
    var code = 
    'release from ' + holder + '.';
    return code;
};

// Left hand
Blockly.Blocks['leftHand'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("left hand");
        $.setOutput(true, "holder");
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['leftHand'] = function (block: any) {
    return ['left hand', bs.ORDER_ATOMIC];
};

// Soul
Blockly.Blocks['soul'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("soul");
        $.setOutput(true, "holder");
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['soul'] = function (block: any) {
    return ['soul', bs.ORDER_ATOMIC];
};

// Orb
Blockly.Blocks['orb'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("orb");
        $.setOutput(true, "object");
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['orb'] = function (block: any) {
    return ['orb', bs.ORDER_ATOMIC];
};

// Enchant
Blockly.Blocks['enchantOrb'] = {
    init: function() {
        const $ = (this as any);
        $.appendDummyInput()
            .appendField("enchant orb with");
        $.appendValueInput("modifier")
            .setCheck(['element', 'modifier'])
            .setAlign(Blockly.ALIGN_RIGHT);
        $.setInputsInline(true);
        $.setOutput(true, "object");
        $.setColour(75);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['enchantOrb'] = function (block: any) {
    var modifier = bs.valueToCode(block, 'modifier', bs.ORDER_ATOMIC) as string;
    var code = 'move enchant orb with ' + modifier + ' to left hand.';
    return [code, bs.ORDER_ATOMIC];
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
        $.setOutput(true, "object");
        $.setColour(75);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['enchant'] = function (block: any) {
    var object = bs.valueToCode(block, 'object', bs.ORDER_ATOMIC) as string;
    var modifier = bs.valueToCode(block, 'modifier', bs.ORDER_ATOMIC) as string;
    var code = 'enchant ' + object + ' with ' + modifier + '.';
    return [code, bs.ORDER_ATOMIC];
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
    var code = 
    'create orb in left hand.\n' +
    'create ' + element + ' in soul.\n' +
    'move enchant orb with ' + element + ' to left hand.\n' +
    'release from left hand.';
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
                'orb becomes enchant orb with ' + element + '.\n';
    return code;
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
    var code = 
    'move ' + object + ' to left hand.\n' +
    'release from left hand.' 
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
    var code = 'say "' + value_element + '"';
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

// Move
Blockly.Blocks['move'] = {
    init: function () {
        const $ = (this as any);
        $.appendValueInput("object")
            .setCheck(['object', 'element'])
            .appendField("move");
        $.appendValueInput("where")
            .setCheck(['holder'])
            .appendField("to");
        $.setInputsInline(true);
        $.setPreviousStatement(true, "statement");
        $.setNextStatement(true, "statement");
        $.setColour(330);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['move'] = function (block: any) {
    var object = bs.valueToCode(block, 'object', bs.ORDER_ATOMIC) as string;
    var where = bs.valueToCode(block, 'where', bs.ORDER_ATOMIC) as string;
    var code = 
    'move ' + object + ' to ' + where + '.\n';
    return code;
};

// Rock
Blockly.Blocks['rock'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("rock");
        $.setOutput(true, "object");
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['rock'] = function (block: any) {
    return ['rock', bs.ORDER_ATOMIC];
};


// Rock
Blockly.Blocks['arrow'] = {
    init: function() {
        let $ = (this as any);
        $.appendDummyInput()
            .appendField("arrow");
        $.setOutput(true, "object");
        $.setColour(230);
        $.setTooltip("");
        $.setHelpUrl("");
    }
};
bs['arrow'] = function (block: any) {
    return ['arrow', bs.ORDER_ATOMIC];
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