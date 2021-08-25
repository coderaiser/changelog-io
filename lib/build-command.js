import rendy from 'rendy';
const gitTemplate = 'git log {{ version }}..HEAD --pretty=format:"- %s" --grep {{ category }}\\(| sed "s/{{ category }}(/(/g"';

export default (category, version) => {
    return rendy(gitTemplate, {
        category,
        version,
    });
}
