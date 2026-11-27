import { describe, expect, it } from 'vitest';
import { readGoal, sessionGoalPath } from '../src/agent/goal.js';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

describe('goal objective clamp', () => {
  it('clamps an objective longer than the write limit when reading goal.json', () => {
    const workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'swarmdeck-goal-'));
    const file = sessionGoalPath(workdir, 'claude', 'session-1');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ objective: 'x'.repeat(9000), status: 'active' }));

    const goal = readGoal(workdir, 'claude', 'session-1');
    expect(goal).not.toBeNull();
    expect(goal!.objective.length).toBe(4000);
  });
});
