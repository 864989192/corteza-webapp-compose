/* eslint-disable */
import { expect } from 'chai'
import Exporter from 'corteza-webapp-compose/src/components/Public/Record/Exporter'
import Module from 'corteza-webapp-compose/src/lib/module'
import { shallowMount } from 'corteza-webapp-compose/tests/lib/helpers'
import sinon from 'sinon'
import moment from 'moment'

describe('components/Public/Record/Exporter.vue', () => {
  afterEach(() => {
    sinon.restore()
  })

  const mm = () => moment("2019-08-22")
  let propsData
  beforeEach(() => {
    propsData = {
      module: new Module(),
    }
  })

  const mountExporter = (opt) => shallowMount(Exporter, {
    propsData,
    ...opt,
  })

  describe('calculate date ranges', () => {
    const cases = [
      {
        range: 'lastMonth',
        start: '2019-07-01',
        end: '2019-07-31',
      },
      {
        range: 'thisMonth',
        start: '2019-08-01',
        end: '2019-08-31',
      },
      {
        range: 'lastWeek',
        start: '2019-08-11',
        end: '2019-08-17',
      },
      {
        range: 'thisWeek',
        start: '2019-08-18',
        end: '2019-08-24',
      },
      {
        range: 'today',
        start: '2019-08-22',
        end: '2019-08-22',
      },
    ]

    it('range start', () => {
      for (const tc of cases) {
        expect(Exporter.methods.calcStart(mm(), tc.range)).to.eq(tc.start)
      }
    })

    it('range end', () => {
      for (const tc of cases) {
        expect(Exporter.methods.calcEnd(mm(), tc.range)).to.eq(tc.end)
      }
    })
  })

  describe('prep export request payload', () => {
    it('no filter', () => {
      propsData.fields = [
        { name: 'f1' },
        { name: 'f2' },
      ]
      const wrap = mountExporter()

      expect(wrap.emitted().export).to.be.undefined
      wrap.vm.doExport('kind')
      const e = wrap.emitted().export.pop().pop()
      expect(e).to.have.keys(['ext', 'fields', 'filters'])
    })

    it('filter', () => {
      let cases = [
        [
          {
            rangeType: 'all',
          },
          '',
        ],
        [
          {
            rangeType: 'range',
            rangeBy: 'created_at',
            date: { start: 'start', end: null }
          },
          'created_at >= "start"',
        ],
        [
          {
            rangeType: 'range',
            rangeBy: 'updated_at',
            date: { start: null, end: 'end' }
          },
          'updated_at <= "end"',
        ],
        [
          {
            rangeBy: 'updated_at',
            date: { start: 'start', end: 'end' }
          },
          'updated_at >= "start" AND updated_at <= "end"',
        ],
      ]

      const wrap = mountExporter()

      for (const [filter, expected] of cases) {
        // console.log(filter)
        wrap.setData({ filter })
        wrap.vm.doExport()
        const e = wrap.emitted().export.pop().pop()
        expect(e.filters).to.eq(expected)
      }
    })
  })

  it('determine if export disabled', () => {
    let cases = [
      [[], 0, true],
      [[], 1, true],
      [[ {} ], 0, true],
      [[ {} ], 1, false],
    ]
    for (const [ fields, recordCount, expected ] of cases) {
      expect(Exporter.computed.exportDisabled
          .call({ fields, recordCount })).to.eq(expected)

    }
  })

  describe('set date filters', () => {
    it('initial: start date', () => {
      propsData.startDate = mm().format()
      const wrap = mountExporter()

      expect(wrap.vm.start).to.not.be.null
      expect(wrap.vm.end).to.be.null
      expect(wrap.vm.range).to.eq('custom')
    })

    it('initial: end date', () => {
      propsData.endDate = mm().format()
      const wrap = mountExporter()

      expect(wrap.vm.start).to.be.null
      expect(wrap.vm.end).to.not.be.null
      expect(wrap.vm.range).to.eq('custom')
    })

    it('initial: start & end date', () => {
      propsData.startDate = mm().format()
      propsData.endDate = mm().format()
      const wrap = mountExporter()

      expect(wrap.vm.start).to.not.be.null
      expect(wrap.vm.end).to.not.be.null
      expect(wrap.vm.range).to.eq('custom')
    })

    it('initial: date range', () => {
      const wrap = mountExporter()

      expect(wrap.vm.start).to.not.be.null
      expect(wrap.vm.end).to.not.be.null
      expect(wrap.vm.range).to.not.eq('custom')
    })
  })
})
