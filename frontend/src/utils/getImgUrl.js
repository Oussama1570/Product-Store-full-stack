function getImgUrl (name) {
    return new URL(`../assets/products/${name}`, import.meta.url)
}

export {getImgUrl}