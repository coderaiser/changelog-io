import rendy from 'rendy';

const gitTemplate = [
    'git log {{ version }}..HEAD --pretty=format:"- %h %s"',
    '--grep "{{ category }}("',
    '--grep "{{ category }}: "',
    '|',
    'sed "s/{{ category }}(/(/g"',
    '|',
    'sed "s/{{ category }}: //g"',
].join(' ');

export default (category, version) => {
    return rendy(gitTemplate, {
        category,
        version,
    });
};
