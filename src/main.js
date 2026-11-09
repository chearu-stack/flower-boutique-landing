import mondayCopy from '../content/week-01/01-monday-rose-sales/post.txt?raw';
import mondayImage from '../content/week-01/01-monday-rose-sales/image.jpg';
import wednesdayCopy from '../content/week-01/03-wednesday-cleopatra-roses/post.txt?raw';
import wednesdayImage from '../content/week-01/03-wednesday-cleopatra-roses/image.jpg';
import fridayCopy from '../content/week-01/05-friday-rose-macro/post.txt?raw';
import fridayImage from '../content/week-01/05-friday-rose-macro/image.jpg';
import sundayCopy from '../content/week-01/07-sunday-natural-photo/post.txt?raw';
import sundayImage from '../content/week-01/07-sunday-natural-photo/image.jpg';
import mobileCover from '../assets/community/vk-cover-mobile.jpg';
import desktopCover from '../assets/community/vk-cover-desktop.jpg';
import './styles.css';

const posts = [
  { id: 'monday', day: 'Понедельник', number: '01', title: 'Когда важен масштаб', image: mondayImage, alt: 'Букет красных роз в строгой тёмной упаковке', text: mondayCopy },
  { id: 'wednesday', day: 'Среда', number: '03', title: 'Розы, изменившие историю', image: wednesdayImage, alt: 'Декоративная сцена с розовыми лепестками', text: wednesdayCopy },
  { id: 'friday', day: 'Пятница', number: '05', title: 'Красота в каждом лепестке', image: fridayImage, alt: 'Крупный план роз с каплями росы', text: fridayCopy },
  { id: 'sunday', day: 'Воскресенье', number: '07', title: 'Эмоция в объективе', image: sundayImage, alt: 'Женщина держит букет в живом уличном кадре', text: sundayCopy },
];

const collectionItems = [
  { image: mondayImage, alt: 'Композиция из красных роз', title: 'Красный бархат', note: 'Объём · выразительность · характер' },
  { image: wednesdayImage, alt: 'Розовые лепестки в атмосферной сцене', title: 'Лепестки истории', note: 'Атмосфера · детали · впечатление' },
  { image: fridayImage, alt: 'Персиковая и бордовая розы крупным планом', title: 'Тихая роскошь', note: 'Текстура · оттенок · свет' },
];

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function demoCopy(source) {
  return source
    .replace(/Напишите в директ или WhatsApp \[укажите номер\/ссылку\]/gi, 'Напишите нам в сообщество')
    .replace(/Напишите нам в WhatsApp \[укажите номер\/ссылку\]/gi, 'Напишите нам в сообщество')
    .replace(/Напишите нам в директ или WhatsApp \[укажите номер\/ссылку\]/gi, 'Напишите нам в сообщество');
}

function renderCollection() {
  const grid = document.querySelector('#collection-grid');
  for (const [index, item] of collectionItems.entries()) {
    const card = element('article', 'collection-card');
    const image = element('img', 'collection-card__image');
    image.src = item.image;
    image.alt = item.alt;
    image.loading = 'lazy';
    image.decoding = 'async';
    const content = element('div', 'collection-card__content');
    const number = element('span', 'collection-card__number', `0${index + 1}`);
    const title = element('h3', '', item.title);
    const note = element('p', '', item.note);
    content.append(number, title, note);
    card.append(image, content);
    grid.append(card);
  }
}

function makeFilter(label, value, selected = false) {
  const button = element('button', `feed-filter${selected ? ' is-active' : ''}`, label);
  button.type = 'button';
  button.dataset.filter = value;
  button.setAttribute('aria-pressed', String(selected));
  return button;
}

function renderFilters() {
  const group = document.querySelector('#feed-filters');
  const filters = [['Все', 'all'], ...posts.map((post) => [post.day, post.id])];
  for (const [index, [label, value]] of filters.entries()) group.append(makeFilter(label, value, index === 0));

  group.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    for (const filter of group.querySelectorAll('[data-filter]')) {
      const active = filter === button;
      filter.classList.toggle('is-active', active);
      filter.setAttribute('aria-pressed', String(active));
    }
    for (const card of document.querySelectorAll('.post-card')) {
      card.hidden = button.dataset.filter !== 'all' && card.dataset.day !== button.dataset.filter;
    }
  });
}

function makePost(post) {
  const article = element('article', 'post-card');
  article.dataset.day = post.id;
  article.id = `post-${post.id}`;

  const header = element('header', 'post-header');
  const avatar = element('div', 'mini-avatar', 'M');
  avatar.setAttribute('aria-hidden', 'true');
  const identity = element('div', 'post-identity');
  identity.append(element('strong', '', 'MAISON DE FLEURS'), element('span', '', `${post.day} · Публикация ${post.number}`));
  const menu = element('span', 'post-menu', '···');
  menu.setAttribute('aria-hidden', 'true');
  header.append(avatar, identity, menu);

  const title = element('h4', 'post-title', post.title);
  const image = element('img', 'post-image');
  image.src = post.image;
  image.alt = post.alt;
  image.loading = 'lazy';
  image.decoding = 'async';

  const paragraphs = demoCopy(post.text).trim().split(/\r?\n\s*\r?\n/).filter(Boolean);
  const excerpt = element('div', 'post-copy post-copy--excerpt');
  for (const paragraph of paragraphs.slice(0, 2)) excerpt.append(element('p', '', paragraph.trim()));

  const details = element('details', 'post-details');
  const summary = element('summary', '', 'Читать публикацию полностью');
  const fullText = element('div', 'post-copy post-copy--full');
  for (const paragraph of paragraphs) fullText.append(element('p', '', paragraph.trim()));
  details.append(summary, fullText);

  const actions = element('div', 'post-actions');
  actions.setAttribute('aria-hidden', 'true');
  actions.append(element('span', '', '♡  Нравится'), element('span', '', '↗  Поделиться'));

  article.append(header, title, image, excerpt, details, actions);
  return article;
}

function renderPosts() {
  const feed = document.querySelector('#post-feed');
  for (const post of posts) feed.append(makePost(post));
}

function installResponsiveCovers() {
  document.querySelectorAll('.hero-art img, .community-cover img').forEach((image) => {
    image.src = mobileCover;
    image.closest('picture').querySelector('source').srcset = desktopCover;
  });
}

installResponsiveCovers();
renderCollection();
renderFilters();
renderPosts();
