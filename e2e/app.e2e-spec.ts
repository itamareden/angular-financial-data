import { AAPage } from './app.po';

describe('aa App', () => {
  let page: AAPage;

  beforeEach(() => {
    page = new AAPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
