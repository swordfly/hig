
import { mount } from 'enzyme';
import * as HIG from 'hig-vanilla';
import React from 'react';

import GlobalNav from './GlobalNavAdapter';

describe('<GlobalNav>', () => {
  /**
     * Creates a hig-vanilla GlobalNav and returns the instance and it's container
     */
  function createHigNav() {
    const higContainer = document.createElement('div');

    // use spread here to clone defaults since HIG.Button mutates this object
    const higNav = new HIG.GlobalNav();

    higNav.mount(higContainer);

    return { higNav, higContainer };
  }

  it('renders the global nav', () => {
    const { higNav, higContainer } = createHigNav();

    const reactContainer = document.createElement('div');
    const wrapper = mount(<GlobalNav />, { attachTo: reactContainer });

    expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();

    expect(reactContainer.firstChild.outerHTML).toEqual(
      higContainer.firstChild.outerHTML
    );
  });

  describe('sideNavOpen prop', () => {
    it('shows an error if it is not a boolean', () => {
      global.console.error = jest.fn();

      mount(<GlobalNav sideNavOpen="foo" />);

      expect(console.error).toBeCalledWith(
        expect.stringMatching(
          /Invalid prop `sideNavOpen` of type `string` supplied to `GlobalNav`, expected `boolean`./
        )
      );
    });

    it('is equal to showSideNav', () => {
      const { higNav, higContainer } = createHigNav();
      const reactContainer = document.createElement('div');
      const wrapper = mount(<GlobalNav />, { attachTo: reactContainer });

      higNav.showSideNav();

      wrapper.setProps({ sideNavOpen: true });

      expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();

      expect(reactContainer.firstChild.outerHTML).toEqual(
        higContainer.firstChild.outerHTML
      );

      higNav.hideSideNav();
      wrapper.setProps({ sideNavOpen: false });

      expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();

      expect(reactContainer.firstChild.outerHTML).toEqual(
        higContainer.firstChild.outerHTML
      );
    });

    it('can showSideNav by default', () => {
      const { higNav, higContainer } = createHigNav();
      const reactContainer = document.createElement('div');
      const wrapper = mount(<GlobalNav sideNavOpen={true} />, {
        attachTo: reactContainer
      });

      higNav.showSideNav();

      expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();

      expect(reactContainer.firstChild.outerHTML).toEqual(
        higContainer.firstChild.outerHTML
      );
    });

    it('can render the SideNav as a child', () => {
      const { higNav, higContainer } = createHigNav();

      const sideNav = new higNav.partials.SideNav();
      higNav.addSideNav(sideNav);

      const reactContainer = document.createElement('div');
      const wrapper = mount(
        <GlobalNav>
          <GlobalNav.SideNav />
        </GlobalNav>,
        {
          attachTo: reactContainer
        }
      );

      expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();

      expect(reactContainer.firstChild.outerHTML).toEqual(
        higContainer.firstChild.outerHTML
      );
    });

    it('can only render a single SideNav', () => {
      expect(() => {
        mount(
          <GlobalNav>
            <GlobalNav.SideNav />
            <GlobalNav.SideNav />
          </GlobalNav>
        );
      }).toThrowError(/only one SideNav is allowed/);
    });
  });

  it('can render the Container as a child', () => {
    const { higNav, higContainer } = createHigNav();

    const reactContainer = document.createElement('div');
    const wrapper = mount(<GlobalNav />, { attachTo: reactContainer });

    expect(reactContainer.firstChild.outerHTML).toMatchSnapshot();

    expect(reactContainer.firstChild.outerHTML).toEqual(
      higContainer.firstChild.outerHTML
    );
  });

  it('can not render arbitrary HTML elements as children', () => {
    global.console.error = jest.fn();

    mount(
      <GlobalNav>
        <GlobalNav.TopNav />
        <div>Hello world!</div>
      </GlobalNav>
    );

    expect(console.error).toBeCalledWith(
      expect.stringMatching(
        /'div' is not a valid child of GlobalNav. Children should be of type 'SideNavAdapter, TopNav, SubNav, Slot'/
      )
    );
  });

  it('can not render text elements as children', () => {
    global.console.error = jest.fn();

    mount(
      <GlobalNav>
        some random child text
      </GlobalNav>
    );

    expect(console.error).toBeCalledWith(
      expect.stringMatching(
        /'some random child text' is not a valid child of GlobalNav. Children should be of type 'SideNavAdapter, TopNav, SubNav, Slot'/
      )
    );
  });
});