import rendy from 'rendy';

const gitTemplate = [
    'git log {{ version }}..HEAD --pretty=format:"- %h %s"',
    '--grep "^{{ category }}("',
    '--grep "^{{ category }}: "',
    '|',
    'sed "s/{{ category }}(/(/"',
    '|',
    'sed "s/{{ category }}: //"',
].join(' ');

export default (category, version) => {
    return rendy(gitTemplate, {
        category,
        version,
    });
};
