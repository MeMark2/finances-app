import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	CircularProgress
} from "@material-ui/core";
import styled from "styled-components";

import useMoneyColorClassGetter from "../../utilities/useMoneyColorClassGetter";
import { useAccountsMap, useBudgetsMap, usePaginatedTransactions } from "../../utilities/apiCallHooks";
import { amountFormatter } from "../../utilities/displayFormatters";
import { Section } from "../../components/layout";

const LoadMoreRow = styled.div`
	text-align: center;
	margin-top: 15px;
`;

function TransactionsTable({ activeDB }) {
	const [budgetsMap] = useBudgetsMap(activeDB);
	const [accountsMap] = useAccountsMap(activeDB);
	const [transactions, loadMoreTransactions, isLoading] = usePaginatedTransactions(activeDB);

  const moneyColorClassGetter = useMoneyColorClassGetter();

	return (
		<Section>
			Transactions
			{budgetsMap && accountsMap && transactions && transactions.length ?
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Account</TableCell>
							<TableCell>Budget</TableCell>
							<TableCell>Date</TableCell>
							<TableCell>Amount</TableCell>
							<TableCell>Description</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{transactions.map((transaction) => {
							const budget = budgetsMap[transaction.budgetID];
							const account = accountsMap[budget.accountID];

							return (
								<TableRow key={transaction.id}>
									<TableCell>{account.name}</TableCell>
									<TableCell>{budget.name}</TableCell>
									<TableCell>{transaction.date}</TableCell>
									<TableCell
										align="right"
										classes={{
										  root: moneyColorClassGetter(transaction.amount)
										}}
									>
										{amountFormatter(transaction.amount)}
									</TableCell>
									<TableCell>{transaction.description}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				: null}
			<LoadMoreRow>
				{isLoading ? <CircularProgress /> :
					<Button
						variant="contained"
						color="primary"
						onClick={loadMoreTransactions}
					>
						Load More
					</Button>
				}
			</LoadMoreRow>
		</Section>
	);
}

export default TransactionsTable;
