import { HeadlessState } from './state';
import { setVisible, createEl } from './util';
import { orientations, files, ranks, ranks10, shogiVariants, xiangqiVariants, Elements, Notation } from './types';
import { createElement as createSVG, setAttributes } from './svg';

export function renderWrap(element: HTMLElement, s: HeadlessState, relative: boolean): Elements {
  // .cg-wrap (element passed to Chessground)
  //   cg-helper (12.5%, display: table)
  //     cg-container (800%)
  //       cg-board
  //       svg.cg-shapes
  //         defs
  //         g
  //       svg.cg-custom-svgs
  //         g
  //       coords.ranks
  //       coords.files
  //       piece.ghost

  element.innerHTML = '';

  // ensure the cg-wrap class is set
  // so bounds calculation can use the CSS width/height values
  // add that class yourself to the element before calling chessground
  // for a slight performance improvement! (avoids recomputing style)
  element.classList.add('cg-wrap');

  for (const c of orientations) element.classList.toggle('orientation-' + c, s.orientation === c);
  element.classList.toggle('manipulable', !s.viewOnly);

  const helper = createEl('cg-helper');
  element.appendChild(helper);
  const container = createEl('cg-container');
  helper.appendChild(container);

  const extension = createEl('extension');
  container.appendChild(extension);
  const board = createEl('cg-board');
  container.appendChild(board);

  let svg: SVGElement | undefined;
  let customSvg: SVGElement | undefined;
  if (s.drawable.visible && !relative) {
    svg = setAttributes(createSVG('svg'), { class: 'cg-shapes' });
    svg.appendChild(createSVG('defs'));
    svg.appendChild(createSVG('g'));
    customSvg = setAttributes(createSVG('svg'), { class: 'cg-custom-svgs' });
    customSvg.appendChild(createSVG('g'));
    container.appendChild(svg);
    container.appendChild(customSvg);
  }

  if (s.coordinates) {
    const orientClass = ' ' + s.orientation;
    const shogi = shogiVariants.includes(s.variant);
    const xiangqi = xiangqiVariants.includes(s.variant);
    if (shogi) {
      container.appendChild(renderCoords(ranks.slice(0, s.dimensions.height).reverse(), 'files' + orientClass));
      container.appendChild(renderCoords(ranks.slice(0, s.dimensions.width).reverse(), 'ranks' + orientClass));
    } else if (s.notation === Notation.JANGGI) {
      container.appendChild(renderCoords(['0'].concat(ranks.slice(0, 9).reverse()), 'ranks' + orientClass));
      container.appendChild(renderCoords(ranks.slice(0, 9), 'files' + orientClass));
    } else if (xiangqi) {
      if (s.orientation === 'white') {
        container.appendChild(renderCoords(ranks10.slice(0, s.dimensions.width).reverse(), 'files' + ' white'));
        container.appendChild(renderCoords(ranks10.slice(0, s.dimensions.width).reverse(), 'files' + ' black'));
      } else {
        container.appendChild(renderCoords(ranks10.slice(0, s.dimensions.width), 'files' + ' white'));
        container.appendChild(renderCoords(ranks10.slice(0, s.dimensions.width), 'files' + ' black'));
      }
    } else {
      container.appendChild(renderCoords(ranks10.slice(0, s.dimensions.height), 'ranks' + orientClass));
      container.appendChild(renderCoords(files.slice(0, s.dimensions.width), 'files' + orientClass));
    }
  }

  let ghost: HTMLElement | undefined;
  if (s.draggable.showGhost && !relative) {
    ghost = createEl('piece', 'ghost');
    setVisible(ghost, false);
    container.appendChild(ghost);
  }

  return {
    board,
    container,
    ghost,
    svg,
    customSvg,
  };
}

function renderCoords(elems: readonly string[], className: string): HTMLElement {
  const el = createEl('coords', className);
  let f: HTMLElement;
  for (const elem of elems) {
    f = createEl('coord');
    f.textContent = elem;
    el.appendChild(f);
  }
  return el;
}
