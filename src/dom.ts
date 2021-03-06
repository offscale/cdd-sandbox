export module DOM {
  export function createElement(
    type: string,
    classes: string[],
    content: Node
  ) {
    var element = document.createElement(type);
    element.appendChild(content);
    for (const klass of classes) {
      element.classList.add(klass);
    }
    return element;
  }

  export function setTextOf(selector, content) {
    let el = document.getElementById(selector);
    el.textContent = content;
  }
}
