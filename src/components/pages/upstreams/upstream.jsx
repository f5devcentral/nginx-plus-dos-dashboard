/**
 * Copyright 2017-present, Nginx, Inc.
 * Copyright 2017-present, Ivan Poluyanov
 * All rights reserved.
 *
 */
import React from 'react';
import appsettings from '../../../appsettings';
import TableSortControl from '../../table/tablesortcontrol.jsx';
import UpstreamsList from '../../upstreams/upstreamslist.jsx';
import utils from '../../../utils.js';
import tooltips from '../../../tooltips/index.jsx';
import PeerTooltip from '../../upstreams/PeerTooltip.jsx';
import ConnectionsTooltip from '../../upstreams/ConnectionsTooltip.jsx';
import styles from '../../table/style.css';

export default class Upstream extends UpstreamsList {
	constructor(props) {
		super(props);

		this.state = {
			...this.state,
			hoveredColumns: false,
			columnsExpanded: appsettings.getSetting(`columns-expanded-http-upstreams-${props.name}`, false)
		};

		this.toggleColumns = this.toggleColumns.bind(this);
		this.hoverColumns = this.hoverColumns.bind(this);
	}

	get SORTING_SETTINGS_KEY() {
		return `sorting-http-upstreams-${this.props.name}`;
	}

	get FILTERING_SETTINGS_KEY() {
		return `filtering-http-upstreams-${this.props.name}`;
	}

	toggleColumns() {
		const columnsExpanded = !this.state.columnsExpanded;

		this.setState({
			columnsExpanded
		});

		appsettings.setSetting(`columns-expanded-http-upstreams-${this.props.name}`, columnsExpanded);
	}

	hoverColumns(hoveredColumns) {
		if (this.state.columnsExpanded) {
			this.setState({
				hoveredColumns
			});
		}
	}

	renderPeers(peers) {
		return (
			<table className={`${ styles.table } ${ styles.wide }${this.state.hoveredColumns ? (' ' + styles['hovered-expander']) : ''}`}>
				<col width="10px" />
				{this.state.editMode ? <col width="1%" /> : null}
				<col width="210px" />
				<col width="1%" />

				<col />
				<col />
				<col />

				<col width="20px" />

				{ this.state.columnsExpanded ? [<col key="0" />, <col key="1" />, <col key="2" />] : null }

				<col />
				<col />
				<col width="1%" />
				<col width="1%" />
				<col width="1%" />
				<col width="1%" />
				<col />
				<col />
				<col />
				<col />
				<col />
				<col />
				<col />
				<col />
				<col />
				<col />

				<thead>
					<tr>
						<TableSortControl
							secondSortLabel="Sort by status - down first"
							order={this.state.sortOrder}
							onChange={this.changeSorting}
						/>

						{ this.getSelectAllCheckbox(peers) }

						<th colSpan="3">Server</th>
						<th colSpan="2">Requests</th>
						<th colSpan={this.state.columnsExpanded ? 6 : 3}>Responses</th>
						<th colSpan="2">Conns</th>
						<th colSpan="4">Traffic</th>
						<th colSpan="2">Server checks</th>
						<th colSpan="4">Health monitors</th>
						<th colSpan="2">Response time</th>
					</tr>
					<tr className={ `${ styles['right-align'] } ${ styles['sub-header'] }` }>
						<th className={ styles['left-align'] }>Name</th>
						<th className={ styles['left-align'] }>
							<span className={ styles.hinted } {...tooltips.useTooltip('Total downtime', 'hint')}>DT</span>
						</th>
						<th className={ `${ styles['center-align'] } ${ styles.bdr }` }>
							<span className={ styles.hinted } {...tooltips.useTooltip('Weight', 'hint')}>W</span>
						</th>

						<th>Total</th>
						<th className={ styles.bdr }>Req/s</th>

						{
							this.state.columnsExpanded ?
								[
									<th className={ styles['center-align'] } key="empty" />,
									<th key="1xx" className={ styles['responses-column'] }>1xx</th>,
									<th key="2xx" className={ styles['responses-column'] }>2xx</th>,
									<th key="3xx" className={ styles['responses-column'] }>3xx</th>
								]
							: <th className={ styles['center-align'] }>...</th>
						}

						<th>4xx</th>
						<th className={ styles.bdr }>5xx</th>

						<th className={ styles['center-align'] }>
							<span className={ styles.hinted } {...tooltips.useTooltip('Active', 'hint')}>A</span>
						</th>
						<th className={ `${ styles['center-align'] } ${ styles.bdr }` }>
							<span className={ styles.hinted } {...tooltips.useTooltip('Limit', 'hint')}>L</span>
						</th>

						<th>Sent/s</th>
						<th>Rcvd/s</th>
						<th >Sent</th>
						<th className={ styles.bdr }>Rcvd</th>
						<th>Fails</th>
						<th className={ styles.bdr }>Unavail</th>
						<th>Checks</th>
						<th>Fails</th>
						<th>Unhealthy</th>
						<th className={ `${ styles.bdr } ${ styles['left-align'] }` }>Last</th>
						<th>Headers</th>
						<th>Response</th>
					</tr>
				</thead>

				<tbody className={ styles['right-align'] }>
					{
						peers.length === 0 ?
							this.renderEmptyList()
						:
							peers.map((peer, i) => (
								<tr>
									<td className={ styles[peer.state] } />

									{ this.getCheckbox(peer) }

									<td className={ `${ styles['left-align'] } ${ styles.bold } ${ styles.address }` }>
										<div className={ styles['address-container'] } {...tooltips.useTooltip(<PeerTooltip peer={peer} />)}>
											{ peer.backup ? <span>b&nbsp;</span> : null }{ peer.server }
										</div>

										{
											this.state.editMode ?
												<span className={ styles['edit-peer'] } onClick={() => this.editSelectedUpstream(peer)} />
											: null
										}
									</td>
									<td className={ styles['left-align'] }>{ utils.formatUptime(peer.downtime, true) }</td>
									<td className={ `${ styles['center-align'] } ${ styles.bdr }` }>{ peer.weight }</td>

									<td>
										<span className={ styles.hinted } {...tooltips.useTooltip(<ConnectionsTooltip peer={peer} />, 'hint')}>
											{ peer.requests }
										</span>
									</td>

									<td className={ styles.bdr }>{ peer.server_req_s }</td>

									{
										this.state.columnsExpanded ?
											[
												i === 0 ? <td className={ styles['collapse-columns'] }
													rowspan={peers.length}
													onClick={this.toggleColumns}
													onMouseEnter={() => this.hoverColumns(true)}
													onMouseLeave={() => this.hoverColumns(false)}
													key="toggle"
												>◀</td> : null,
												<td className={ styles['responses-column'] } key="1xx">{ peer.responses['1xx'] }</td>,
												<td className={ styles['responses-column'] } key="2xx">{ peer.responses['2xx'] }</td>,
												<td className={ styles['responses-column'] } key="3xx">{ peer.responses['3xx'] }</td>
											]
											: i === 0 ? <td className={ styles['collapse-columns'] } rowspan={peers.length} onClick={this.toggleColumns}>▶</td> : null
									}

									<td className={`${ styles.flash }${peer['4xxChanged'] ? (' ' + styles['red-flash']) : ''}`}>
										{ peer.responses['4xx'] }
									</td>
									<td className={`${ styles.bdr } ${ styles.flash }${peer['5xxChanged'] ? (' ' + styles['red-flash']) : ''}`}>
										{ peer.responses['5xx'] }
									</td>

									<td className={ styles['center-align'] }>{ peer.active }</td>
									<td className={ `${ styles['center-align'] } ${ styles.bdr }` }>
										{ peer.max_conns === Infinity ? <span>&infin;</span> : peer.max_conns }
									</td>

									<td className={ styles.px60 }>{ utils.formatReadableBytes(peer.server_sent_s) }</td>
									<td className={ styles.px60 }>{ utils.formatReadableBytes(peer.server_rcvd_s) }</td>
									<td>{ utils.formatReadableBytes(peer.sent) }</td>
									<td>{ utils.formatReadableBytes(peer.received) }</td>
									<td>{ peer.fails }</td>
									<td className={ styles.bdr }>{ peer.unavail }</td>

									<td>{ peer.health_checks.checks }</td>
									<td>{ peer.health_checks.fails }</td>
									<td>{ peer.health_checks.unhealthy }</td>

									<td className={`${ styles['left-align'] } ${ styles.bdr } ${ styles.flash }${peer.health_status === false ? (' ' + styles['red-flash']) : ''}`}>
										{ peer.health_status === null ? '–' : peer.health_status ? 'passed' : 'failed' }
									</td>

									<td>{ utils.formatMs(peer.header_time) }</td>
									<td>{ utils.formatMs(peer.response_time) }</td>
								</tr>
							))
					}
				</tbody>
			</table>
		);
	}
}