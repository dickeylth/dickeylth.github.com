require('shelljs/global');

var fs = require('fs');

function updateManifest() {
	var filePath = './source/site.appcache';
	var fileContent = fs.readFileSync(filePath, 'utf-8');
	fileContent = fileContent.replace(/# Revision (\d)*/, '# Revision ' + Date.now());
	fs.writeFileSync(filePath, fileContent);
}

updateManifest();
exec('hexo clean');
exec('hexo deploy -g');
exec('git add . -A;git commit -m "update blog";git push origin src');