import R from 'ramda';
import { core } from './commands/lfsCommands';

const builldArgs = (options) => {
  const opts = (options || {});
  const args = [];
  if (opts.local) {
    args.push('--local');
  }
  return R.join(' ', args);
};

const initialize = async (repo, options) => {
  const workdir = repo.workdir();

  let needsInstall = false;
  try {
    const repoConfig = await (await repo.config()).snapshot();
    console.log('loaded config');

    // if for some reason we can't open the config, don't install
    needsInstall = true;

    // throws if not found
    await repoConfig.getString('filter.lfs.clean');
    await repoConfig.getString('filter.lfs.smudge');
    await repoConfig.getString('filter.lfs.process');

    needsInstall = false;
  } catch (err) { /* ignore */ }

  console.log({ needsInstall });
  if (needsInstall) {
    await core.install(builldArgs(options), { cwd: workdir });
  }
};

export default initialize;
