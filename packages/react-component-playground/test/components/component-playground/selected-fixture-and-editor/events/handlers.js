const FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, () => {
  const _ = require('lodash');
  const render = require('helpers/render-component');
  const localStorageLib = require('component-playground/lib/local-storage');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));
  });

  describe('on fixture update', () => {
    let stateSet;

    beforeEach(() => {
      sinon.spy(component, 'setState');

      component.onMessage({
        data: {
          type: 'fixtureUpdate',
          fixtureBody: {
            state: {
              somethingHappened: true,
            },
          },
        },
      });

      stateSet = component.setState.lastCall.args[0];
    });

    afterEach(() => {
      component.setState.restore();
    });

    it('should mark user input state as valid', () => {
      expect(stateSet.isFixtureUserInputValid).to.equal(true);
    });

    it('should override serializable fixture part', () => {
      expect(stateSet.fixtureContents).to.deep.equal({
        ...fixture.state.fixtureContents,
        state: {
          somethingHappened: true,
        },
      });
    });

    it('should keep unserializable fixture part', () => {
      Object.keys(fixture.state.fixtureUnserializableProps).forEach(key => {
        expect(stateSet.fixtureContents[key]).to.be.undefined;
      });
    });

    it('should update stringified child snapshot state', () => {
      expect(stateSet.fixtureUserInput).to.equal(JSON.stringify({
        ...fixture.state.fixtureContents,
        state: {
          somethingHappened: true,
        },
      }, null, 2));
    });
  });

  it('should save split-pane position in local storage on change', () => {
    expect(component.refs.splitPane.props.onChange())
      .to.equal(localStorageLib.set('splitPos'));
  });

  it('should get split-pane default size from local storage', () => {
    expect(component.refs.splitPane.props.defaultSize)
      .to.equal(localStorageLib.get('splitPos'));
  });
});
