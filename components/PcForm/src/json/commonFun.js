export function copyBindItem(item) {
  let chilItem = JSON.parse(JSON.stringify(item))
  const key = Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
  chilItem.key = key;
  chilItem.model = `${chilItem.type}_${key}`;
  if(chilItem.type === 'grid') {
    const columns = chilItem.columns;
    for(let i = 0;i < columns.length;i++) {
      const listItem = columns[i].list[0];
      const listItemKey = Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999);
      listItem.key = listItemKey;
      listItem.model = `${listItem.type}_${listItemKey}`;
    }
  }
  return chilItem;
}