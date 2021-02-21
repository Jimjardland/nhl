import 'jest'
import * as playoffs from '../playoffs'
import expected from './__fixtures__/expectedPlayoffResult'
import requestRespone from './__fixtures__/requestResponsePlayoff'

describe('#Playoffs', () => {
  beforeEach(() => {})
  it('returns the correct tree of playoffs', async () => {
    const res = await playoffs.buildPlayOff(requestRespone)
    expect(res).toEqual(expected)
  })
})
