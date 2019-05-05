### App and Lib Bundle
- supports HMR
- This setup allows you to use your components as a single page app AND as a stand alone component library for use in other projects.
- You can distribute and deploy the `public` folder as a single page app.
- Webpack will also bundle each exported component from `src/index.js`, using code splitting. You can consume the component library by importing the `lib/gradwohl.min.js` file.

### Workflow
- feature (off master) -> staging -> master

### TODO
- add logging/reporting
- add circle ci and delpoy to aws
- add testing for components, services, store
- add test coverage

### Automatic Node.js Versioning
- This project makes use of .nvmrc file.
- Add the following to your .zshrc for automatic node versioning:
```
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
# place this after nvm initialization!
autoload -U add-zsh-hook
load-nvmrc() {
  if [[ -f .nvmrc && -r .nvmrc ]]; then
    nvm use
  elif [[ $(nvm version) != $(nvm version default)  ]]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```