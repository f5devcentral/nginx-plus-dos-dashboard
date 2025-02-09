/**
 * Copyright 2017-present, Nginx, Inc.
 * Copyright 2017-present, Igor Meleschenko
 * All rights reserved.
 *
 */

import React from 'react';
import { shallow } from 'enzyme';
import { spy, stub } from 'sinon';
import Locations from '../locationzones.jsx';
import SortableTable from '../../../table/sortabletable.jsx';
import styles from '../../../table/style.css';
import utils from '../../../../utils';
import tooltips from '../../../../tooltips/index.jsx';

describe('<Locations />', () => {
	it('extends SortableTable', () => {
		expect(Locations.prototype instanceof SortableTable).to.be.true;
	});

	it('get SORTING_SETTINGS_KEY', () => {
		const wrapper = shallow(<Locations />);

		expect(wrapper.instance().SORTING_SETTINGS_KEY).to.be.equal('locationsSortOrder');

		wrapper.unmount();
	});

	describe('render()', () => {
		it('no locations', () => {
			const wrapper = shallow(<Locations />);

			expect(wrapper, 'return value').to.have.lengthOf(0);

			wrapper.unmount();
		});

		it('sort locations', () => {
			const wrapper = shallow(
				<Locations data={ new Map([
					['test', {
						alert: false,
						warning: false,
						responses: {}
					}], ['test_2', {
						alert: true,
						warning: false,
						responses: {}
					}], ['test_3', {
						alert: false,
						warning: true,
						responses: {}
					}]
				]) } />
			);
			let rows = wrapper.find('tbody tr');

			expect(rows.at(0).find('td').at(1).text(), 'row 1, title').to.be.equal('test');
			expect(rows.at(1).find('td').at(1).text(), 'row 2, title').to.be.equal('test_2');
			expect(rows.at(2).find('td').at(1).text(), 'row 3, title').to.be.equal('test_3');

			let sortSpy = spy(Array.prototype, 'sort');

			wrapper.setState({ sortOrder: 'desc' });
			rows = wrapper.find('tbody tr');

			expect(rows.at(2).find('td').at(1).text(), 'row 3, title [desc]').to.be.equal('test');
			expect(sortSpy.calledOnce, 'Array sort called once').to.be.true;
			expect(sortSpy.args[0][0](['', { alert: true, warning: false }], []), 'Array sort fn').to.be.equal(-1);
			expect(sortSpy.args[0][0](['', { alert: false, warning: true }], []), 'Array sort fn').to.be.equal(-1);
			expect(sortSpy.args[0][0](['', { alert: false, warning: false }], []), 'Array sort fn').to.be.equal(1);

			sortSpy.restore();
			wrapper.unmount();
		});

		it('component', () => {
			const wrapper = shallow(
				<Locations data={[]} />
			);
			const table = wrapper.find(`.${ styles['table'] }`);
			const sortControl = table.find('TableSortControl');

			expect(wrapper.getElement().nodeName, 'wrapper html tag').to.be.equal('div');
			expect(table.length, 'table container').to.be.equal(1);
			expect(table.hasClass(styles['wide']), 'table has class "wide"').to.be.true;
			expect(sortControl.length, 'TableSortControl length').to.be.equal(1);
			expect(sortControl.prop('order'), 'TableSortControl "order" prop').to.be.equal(
				wrapper.state('sortOrder')
			);
			expect(sortControl.prop('onChange').name, 'TableSortControl "onChange" prop').to.be.equal(
				'bound changeSorting'
			);

			wrapper.unmount();
		});

		it('location row', () => {
			stub(tooltips, 'useTooltip').callsFake(() => ({
				prop_from_useTooltip: true
			}));
			stub(utils, 'formatReadableBytes').callsFake(
				a => `formatted_${ a }`
			);

			const wrapper = shallow(
				<Locations data={ new Map([
					['test', {
						warning: false,
						'5xxChanged': false,
						requests: 100,
						zone_req_s: 10,
						responses: {
							'1xx': 0,
							'2xx': 500,
							'3xx': 1,
							'4xx': 5,
							'5xx': 0,
							total: 506
						},
						'4xxChanged': false,
						discarded: 2,
						sent_s: 1,
						rcvd_s: 2,
						sent: 3,
						received: 4
					}], ['test_2', {
						warning: true,
						'5xxChanged': false,
						requests: 1000,
						zone_req_s: 100,
						responses: {
							'1xx': 1,
							'2xx': 5000,
							'3xx': 10,
							'4xx': 50,
							'5xx': 1,
							total: 5062
						},
						'4xxChanged': true,
						discarded: 3,
						sent_s: 2,
						rcvd_s: 3,
						sent: 4,
						received: 5
					}], ['test_3', {
						warning: false,
						'5xxChanged': true,
						requests: 10,
						zone_req_s: 1,
						responses: {
							'1xx': 0,
							'2xx': 2,
							'3xx': 0,
							'4xx': 0,
							'5xx': 0,
							total: 2
						},
						'4xxChanged': false,
						discarded: 4,
						sent_s: 3,
						rcvd_s: 4,
						sent: 5,
						received: 6
					}]
				]) } />
			);
			const rows = wrapper.find('tbody tr');
			let cells, cell;

			expect(rows.length, 'rows length').to.be.equal(3);

			cells = rows.at(0).find('td');
			expect(cells.length, 'row 1, cells length').to.be.equal(14);
			expect(cells.at(0).prop('className'), 'row 1, cell 1, className').to.be.equal(
				styles['ok']
			);
			cell = cells.at(1);
			expect(cell.prop('className'), 'row 1, cell 2, className').to.be.equal(
				`${ styles['left-align'] } ${ styles['bold'] } ${ styles['bdr'] }`
			);
			expect(cell.text(), 'row 1, cell 2, text').to.be.equal('test');
			expect(cells.at(2).text(), 'row 1, cell 3, text').to.be.equal('100');
			cell = cells.at(3);
			expect(cell.prop('className'), 'row 1, cell 4, className').to.be.equal(
				styles['bdr']
			);
			expect(cell.text(), 'row 1, cell 4, text').to.be.equal('10');
			expect(cells.at(4).text(), 'row 1, cell 5, text').to.be.equal('0');
			expect(cells.at(5).text(), 'row 1, cell 6, text').to.be.equal('500');
			expect(cells.at(6).text(), 'row 1, cell 7, text').to.be.equal('1');
			cell = cells.at(7);
			expect(cell.prop('className'), 'row 1, cell 8, className').to.be.equal(
				styles['flash']
			);
			expect(cell.childAt(0).prop('className'), 'row 1, cell 8, child className')
				.to.be.equal(styles['hinted']);
			expect(cell.childAt(0).prop('prop_from_useTooltip'), 'row 1, cell 8, child useTooltip')
				.to.be.true;
			expect(cell.childAt(0).text(), 'row 1, cell 8, child text').to.be.equal('7');
			cell = cells.at(8);
			expect(cell.prop('className'), 'row 1, cell 9, className').to.be.equal(
				styles['flash']
			);
			expect(cell.text(), 'row 1, cell 9, text').to.be.equal('0');
			cell = cells.at(9);
			expect(cell.prop('className'), 'row 1, cell 10, className').to.be.equal(
				styles['bdr']
			);
			expect(cell.text(), 'row 1, cell 10, text').to.be.equal('506');
			cell = cells.at(10);
			expect(cell.prop('className'), 'row 1, cell 11, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 1, cell 11, text').to.be.equal('formatted_1');
			cell = cells.at(11);
			expect(cell.prop('className'), 'row 1, cell 12, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 1, cell 12, text').to.be.equal('formatted_2');
			cell = cells.at(12);
			expect(cell.prop('className'), 'row 1, cell 13, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 1, cell 13, text').to.be.equal('formatted_3');
			cell = cells.at(13);
			expect(cell.prop('className'), 'row 1, cell 14, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 1, cell 14, text').to.be.equal('formatted_4');

			cells = rows.at(1).find('td');
			expect(cells.length, 'row 2, cells length').to.be.equal(14);
			expect(cells.at(0).prop('className'), 'row 2, cell 1, className').to.be.equal(
				styles['warning']
			);
			cell = cells.at(1);
			expect(cell.prop('className'), 'row 2, cell 2, className').to.be.equal(
				`${ styles['left-align'] } ${ styles['bold'] } ${ styles['bdr'] }`
			);
			expect(cell.text(), 'row 2, cell 2, text').to.be.equal('test_2');
			expect(cells.at(2).text(), 'row 2, cell 3, text').to.be.equal('1000');
			cell = cells.at(3);
			expect(cell.prop('className'), 'row 2, cell 4, className').to.be.equal(
				styles['bdr']
			);
			expect(cell.text(), 'row 2, cell 4, text').to.be.equal('100');
			expect(cells.at(4).text(), 'row 2, cell 5, text').to.be.equal('1');
			expect(cells.at(5).text(), 'row 2, cell 6, text').to.be.equal('5000');
			expect(cells.at(6).text(), 'row 2, cell 7, text').to.be.equal('10');
			cell = cells.at(7);
			expect(cell.prop('className'), 'row 2, cell 8, className').to.be.equal(
				`${ styles['flash'] } ${ styles['red-flash'] }`
			);
			expect(cell.childAt(0).prop('className'), 'row 2, cell 8, child className')
				.to.be.equal(styles['hinted']);
			expect(cell.childAt(0).prop('prop_from_useTooltip'), 'row 2, cell 8, child useTooltip')
				.to.be.true;
			expect(cell.childAt(0).text(), 'row 2, cell 8, child text').to.be.equal('53');
			cell = cells.at(8);
			expect(cell.prop('className'), 'row 2, cell 9, className').to.be.equal(
				styles['flash']
			);
			expect(cell.text(), 'row 2, cell 9, text').to.be.equal('1');
			cell = cells.at(9);
			expect(cell.prop('className'), 'row 2, cell 10, className').to.be.equal(
				styles['bdr']
			);
			expect(cell.text(), 'row 2, cell 10, text').to.be.equal('5062');
			cell = cells.at(10);
			expect(cell.prop('className'), 'row 2, cell 11, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 2, cell 11, text').to.be.equal('formatted_2');
			cell = cells.at(11);
			expect(cell.prop('className'), 'row 2, cell 12, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 2, cell 12, text').to.be.equal('formatted_3');
			cell = cells.at(12);
			expect(cell.prop('className'), 'row 2, cell 13, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 2, cell 13, text').to.be.equal('formatted_4');
			cell = cells.at(13);
			expect(cell.prop('className'), 'row 2, cell 14, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 2, cell 14, text').to.be.equal('formatted_5');

			cells = rows.at(2).find('td');
			expect(cells.length, 'row 3, cells length').to.be.equal(14);
			expect(cells.at(0).prop('className'), 'row 3, cell 1, className').to.be.equal(
				styles['alert']
			);
			cell = cells.at(1);
			expect(cell.prop('className'), 'row 3, cell 2, className').to.be.equal(
				`${ styles['left-align'] } ${ styles['bold'] } ${ styles['bdr'] }`
			);
			expect(cell.text(), 'row 3, cell 2, text').to.be.equal('test_3');
			expect(cells.at(2).text(), 'row 3, cell 3, text').to.be.equal('10');
			cell = cells.at(3);
			expect(cell.prop('className'), 'row 3, cell 4, className').to.be.equal(
				styles['bdr']
			);
			expect(cell.text(), 'row 3, cell 4, text').to.be.equal('1');
			expect(cells.at(4).text(), 'row 3, cell 5, text').to.be.equal('0');
			expect(cells.at(5).text(), 'row 3, cell 6, text').to.be.equal('2');
			expect(cells.at(6).text(), 'row 3, cell 7, text').to.be.equal('0');
			cell = cells.at(7);
			expect(cell.prop('className'), 'row 3, cell 8, className').to.be.equal(
				styles['flash']
			);
			expect(cell.childAt(0).prop('className'), 'row 3, cell 8, child className')
				.to.be.equal(styles['hinted']);
			expect(cell.childAt(0).prop('prop_from_useTooltip'), 'row 3, cell 8, child useTooltip')
				.to.be.true;
			expect(cell.childAt(0).text(), 'row 3, cell 8, child text').to.be.equal('4');
			cell = cells.at(8);
			expect(cell.prop('className'), 'row 3, cell 9, className').to.be.equal(
				`${ styles['flash'] } ${ styles['red-flash'] }`
			);
			expect(cell.text(), 'row 3, cell 9, text').to.be.equal('0');
			cell = cells.at(9);
			expect(cell.prop('className'), 'row 3, cell 10, className').to.be.equal(
				styles['bdr']
			);
			expect(cell.text(), 'row 3, cell 10, text').to.be.equal('2');
			cell = cells.at(10);
			expect(cell.prop('className'), 'row 3, cell 11, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 3, cell 11, text').to.be.equal('formatted_3');
			cell = cells.at(11);
			expect(cell.prop('className'), 'row 3, cell 12, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 3, cell 12, text').to.be.equal('formatted_4');
			cell = cells.at(12);
			expect(cell.prop('className'), 'row 3, cell 13, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 3, cell 13, text').to.be.equal('formatted_5');
			cell = cells.at(13);
			expect(cell.prop('className'), 'row 3, cell 14, className').to.be.equal(
				styles['px60']
			);
			expect(cell.text(), 'row 3, cell 14, text').to.be.equal('formatted_6');

			expect(tooltips.useTooltip.calledThrice, 'useTooltip called').to.be.true;
			expect(
				tooltips.useTooltip.args[0][0].children[0],
				'useTooltip call 1, arg 1, children 1'
			).to.be.equal('4xx: 5 ');
			expect(
				tooltips.useTooltip.args[0][0].children[2],
				'useTooltip call 1, arg 1, children 3'
			).to.be.equal(' 499/444/408: 2');
			expect(tooltips.useTooltip.args[0][1], 'useTooltip call 1, arg 2').to.be.equal('hint');
			expect(
				tooltips.useTooltip.args[1][0].children[0],
				'useTooltip call 2, arg 1, children 1'
			).to.be.equal('4xx: 50 ');
			expect(
				tooltips.useTooltip.args[1][0].children[2],
				'useTooltip call 2, arg 1, children 3'
			).to.be.equal(' 499/444/408: 3');
			expect(tooltips.useTooltip.args[1][1], 'useTooltip call 2, arg 2').to.be.equal('hint');
			expect(
				tooltips.useTooltip.args[2][0].children[0],
				'useTooltip call 3, arg 1, children 1'
			).to.be.equal('4xx: 0 ');
			expect(
				tooltips.useTooltip.args[2][0].children[2],
				'useTooltip call 3, arg 1, children 3'
			).to.be.equal(' 499/444/408: 4');
			expect(tooltips.useTooltip.args[2][1], 'useTooltip call 3, arg 2').to.be.equal('hint');

			expect(utils.formatReadableBytes.callCount, 'useTooltip called').to.be.equal(12);
			expect(utils.formatReadableBytes.args[0][0], 'useTooltip call 1 arg').to.be.equal(1);
			expect(utils.formatReadableBytes.args[1][0], 'useTooltip call 2 arg').to.be.equal(2);
			expect(utils.formatReadableBytes.args[2][0], 'useTooltip call 3 arg').to.be.equal(3);
			expect(utils.formatReadableBytes.args[3][0], 'useTooltip call 4 arg').to.be.equal(4);
			expect(utils.formatReadableBytes.args[4][0], 'useTooltip call 5 arg').to.be.equal(2);
			expect(utils.formatReadableBytes.args[5][0], 'useTooltip call 6 arg').to.be.equal(3);
			expect(utils.formatReadableBytes.args[6][0], 'useTooltip call 7 arg').to.be.equal(4);
			expect(utils.formatReadableBytes.args[7][0], 'useTooltip call 8 arg').to.be.equal(5);
			expect(utils.formatReadableBytes.args[8][0], 'useTooltip call 9 arg').to.be.equal(3);
			expect(utils.formatReadableBytes.args[9][0], 'useTooltip call 10 arg').to.be.equal(4);
			expect(utils.formatReadableBytes.args[10][0], 'useTooltip call 11 arg').to.be.equal(5);
			expect(utils.formatReadableBytes.args[11][0], 'useTooltip call 12 arg').to.be.equal(6);

			utils.formatReadableBytes.restore();
			tooltips.useTooltip.restore();
			wrapper.unmount();
		});
	});
});
