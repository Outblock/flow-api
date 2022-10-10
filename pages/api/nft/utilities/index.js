async function pagination(collectionIds, limitParam, offsetParam) {
	const limit = parseInt(limitParam);
	const offset = parseInt(offsetParam);
	let nftCount = 0;
  for (const prop in collectionIds) {
    nftCount = nftCount + collectionIds[prop].length
  }
  let collectionNames = Object.keys(collectionIds);
	collectionNames = collectionNames.sort();
	let finalResultMap = {};
  if (parseInt(offset) > nftCount) {
    return undefined;
	} else {
		let currentOffset = 0
		let leftLimit = limit
		// iterate by sorted keys
		for ( const collectionName of collectionNames) {

			let valueArray = collectionIds[collectionName]
			valueArray = valueArray.sort();
			// console.log(valueArray);
			// console.log(collectionNames);
			// offset start in this slice

			if ((valueArray.length+currentOffset) >= offset) {
				if ((currentOffset+valueArray.length) >= (offset+limit)) {
					let start = 0;
					if (currentOffset > offset) {
						start = 0
					} else {
						start = offset - currentOffset
					}
					
					valueArray = valueArray.slice(start, start+leftLimit)
					finalResultMap[collectionName] = valueArray
					break
				} else {
					let start = 0;
					if (currentOffset > offset) {
						start = 0
					} else {
						start = offset - currentOffset
					}
					currentOffset += valueArray.length
					valueArray = valueArray.slice(start)
					leftLimit -= valueArray.length
					finalResultMap[collectionName] = valueArray
				}
			} else {
				currentOffset += valueArray.length;
			}
		}
		// log.Println("final Result map: ", finalResultMap)

	}

  return finalResultMap;
}


async function nftMedia(nfts) {
	for (const k of nfts) {

		const postMedia = {}
		if (k.thumbnail.includes('ipfs://')) {
			postMedia['image'] = k.thumbnail.replace('ipfs://', 'https://lilico.app/api/ipfs/')
		} else if (k.thumbnail.includes('https://ipfs.io/')) {
			postMedia['image'] = k.thumbnail.replace('ipfs://', 'https://lilico.app/')
		} else if (k.thumbnail.includes('.mp4')){
			postMedia['video'] = k.thumbnail
		} else if (k.thumbnail.includes('.mp3')){
			postMedia['music'] = k.thumbnail
		} else {
			postMedia['image'] = k.thumbnail
		}
		if (k.thumbnail.includes('.svg')) {
			postMedia['isSvg'] = true
		} else {
			postMedia['isSvg'] = false
		}
		postMedia['description'] = k.description
		postMedia['title'] = k.name
		k['postMedia'] = postMedia;
  }

	let finalResultMap = nfts;

  return finalResultMap;
}
  
function convertType(type) {
	const regex = /A\.[0-9a-f]{16}\./g
	return type.replaceAll(regex, "")
}

module.exports = {
	pagination,
	nftMedia,
	convertType
}