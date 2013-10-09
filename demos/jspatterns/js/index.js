/**
 * Created by dickey on 13-10-9.
 */
(function initCode(){

    $('.ace-code').each(function(idx, ele){
        var editorNode = $(ele);
        var wrapperNode = editorNode.parent('div');
        var scriptNode = wrapperNode.find('.ace-code-script');
        var btnNode = wrapperNode.find('.J_RunBtn');
        var outputNode = wrapperNode.find('.J_Output');

        var editor = ace.edit(ele);
        var value = scriptNode.html().trim();
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");

        editor.setOptions({
            fontSize: 14,
            maxLines: 20,
            tabSize: 4,
            useSoftTabs: true,
            showPrintMargin: false,
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableEmmet: true
        });

        editor.setValue(value, -1);

        if(btnNode){
            btnNode.on('click', function(){
                var value = editor.getValue();
                outputNode.html(eval(value));
            });
        }
    });
})();