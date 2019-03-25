import { MZCTemplatePage } from './app.po';

describe('abp-project-name-template App', function() {
  let page: MZCTemplatePage;

  beforeEach(() => {
    page = new MZCTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
